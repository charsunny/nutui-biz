import { useMemo } from 'react'
import type { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { floatData } from '../../utils'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { LongPressShell } from './longPressShell'
import { SwipeShell } from './swipeShell'
import type { AddressListHandler, IDataInfo } from './types'

export type { AddressListHandler, IDataInfo, functionType } from './types'

export interface AddressListProps extends IComponent {
  /** 地址数组, 字段名不同时用 dataMapOptions 映射 */
  data: Array<Record<string, any>>
  longPress: boolean
  swipeEdition: boolean
  showBottomButton: boolean
  /** IDataInfo 字段 → data 中的字段名 (或取值函数) */
  dataMapOptions: Partial<Record<keyof IDataInfo, string | ((item: any) => any)>>
  onAdd?: (event: any) => void
  onDelIcon?: AddressListHandler
  onEditIcon?: AddressListHandler
  onItemClick?: AddressListHandler
  onSwipeDel?: AddressListHandler
  onLongCopy?: AddressListHandler
  onLongSet?: AddressListHandler
  onLongDel?: AddressListHandler
}

const DATA_INFO: IDataInfo = {
  id: '',
  addressName: '',
  phone: '',
  defaultAddress: false,
  fullAddress: '',
}

const EMPTY: never[] = []
const EMPTY_MAP = {}

export const AddressList: FunctionComponent<Partial<AddressListProps>> = ({
  className,
  style,
  data = EMPTY,
  longPress = false,
  swipeEdition = false,
  showBottomButton = true,
  dataMapOptions = EMPTY_MAP,
  onAdd,
  onDelIcon,
  onEditIcon,
  onItemClick,
  onSwipeDel,
  onLongCopy,
  onLongSet,
  onLongDel,
}) => {
  const { locale } = useConfig()
  const b = bem('address-list')

  const list = useMemo<IDataInfo[]>(
    () => data.map((item) => floatData(DATA_INFO, item, dataMapOptions)),
    [data, dataMapOptions]
  )

  return (
    <View
      className={classNames(b({ 'with-bottom': showBottomButton }), className)}
      style={style}
    >
      {list.map((item, index) =>
        swipeEdition ? (
          <SwipeShell
            key={`${item.id}-${index}`}
            item={item}
            onDelIcon={onDelIcon}
            onEditIcon={onEditIcon}
            onItemClick={onItemClick}
            onSwipeDel={onSwipeDel}
          />
        ) : (
          <LongPressShell
            key={`${item.id}-${index}`}
            item={item}
            longPress={longPress}
            onDelIcon={onDelIcon}
            onEditIcon={onEditIcon}
            onItemClick={onItemClick}
            onLongCopy={onLongCopy}
            onLongSet={onLongSet}
            onLongDel={onLongDel}
          />
        )
      )}
      {showBottomButton && (
        <View className={b('bottom')}>
          <Button block type="primary" onClick={(event) => onAdd?.(event)}>
            {locale.addresslist.addAddress}
          </Button>
        </View>
      )}
    </View>
  )
}

AddressList.displayName = 'NbAddressList'
