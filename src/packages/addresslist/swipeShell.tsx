import { useRef } from 'react'
import type { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Button, Swipe } from '@nutui/nutui-react-taro'
import bem from '../../utils/bem'
import { useConfig } from '../configprovider'
import { ItemContents } from './itemContents'
import type { AddressListHandler, IDataInfo } from './types'

export interface SwipeShellProps {
  item: IDataInfo
  onDelIcon?: AddressListHandler
  onEditIcon?: AddressListHandler
  onItemClick?: AddressListHandler
  onSwipeDel?: AddressListHandler
}

export const SwipeShell: FunctionComponent<SwipeShellProps> = ({
  item,
  onDelIcon,
  onEditIcon,
  onItemClick,
  onSwipeDel,
}) => {
  const { locale } = useConfig()
  const b = bem('address-list')
  // 滑动过程中不触发点击
  const moved = useRef(false)

  const handleItemClick: AddressListHandler = (event, data) => {
    if (moved.current) return
    onItemClick?.(event, data)
  }

  return (
    <Swipe
      className={b('swipe-wrap')}
      rightAction={
        <Button
          className={b('swipe-del')}
          shape="square"
          type="primary"
          onClick={(event: any) => {
            event?.stopPropagation?.()
            onSwipeDel?.(event, item)
          }}
        >
          {locale.swipeShell.delete}
        </Button>
      }
    >
      <View
        className={b('swipe')}
        onTouchStart={() => {
          moved.current = false
        }}
        onTouchMove={() => {
          moved.current = true
        }}
      >
        <ItemContents
          item={item}
          onDelIcon={onDelIcon}
          onEditIcon={onEditIcon}
          onClickItem={handleItemClick}
        />
      </View>
    </Swipe>
  )
}

SwipeShell.displayName = 'NbAddressListSwipeShell'
