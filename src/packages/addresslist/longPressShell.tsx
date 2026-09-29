import { useEffect, useRef, useState } from 'react'
import type { FunctionComponent } from 'react'
import { View, Text } from '@tarojs/components'
import type { ITouchEvent } from '@tarojs/components'
import bem from '../../utils/bem'
import { useConfig } from '../configprovider'
import { ItemContents } from './itemContents'
import type { AddressListHandler, IDataInfo } from './types'

export interface LongPressShellProps {
  item: IDataInfo
  longPress: boolean
  onLongCopy?: AddressListHandler
  onLongSet?: AddressListHandler
  onLongDel?: AddressListHandler
  onDelIcon?: AddressListHandler
  onEditIcon?: AddressListHandler
  onItemClick?: AddressListHandler
}

const LONG_PRESS_DELAY = 300

export const LongPressShell: FunctionComponent<LongPressShellProps> = ({
  item,
  longPress,
  onLongCopy,
  onLongSet,
  onLongDel,
  onDelIcon,
  onEditIcon,
  onItemClick,
}) => {
  const { locale } = useConfig()
  const b = bem('address-list')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  // 长按后松手会再触发一次点击, 用它屏蔽
  const pressed = useRef(false)
  const [showMask, setShowMask] = useState(false)

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = undefined
  }

  useEffect(() => clearTimer, [])

  const handleTouchStart = () => {
    if (!longPress) return
    pressed.current = false
    clearTimer()
    timer.current = setTimeout(() => {
      pressed.current = true
      setShowMask(true)
    }, LONG_PRESS_DELAY)
  }

  const handleItemClick: AddressListHandler = (event, data) => {
    if (pressed.current) {
      pressed.current = false
      return
    }
    onItemClick?.(event, data)
  }

  const action = (fn?: AddressListHandler) => (event: ITouchEvent) => {
    event.stopPropagation()
    setShowMask(false)
    fn?.(event, item)
  }

  const hideMask = (event: ITouchEvent) => {
    event.stopPropagation()
    if (pressed.current) {
      pressed.current = false
      return
    }
    setShowMask(false)
  }

  return (
    <View
      className={b('general')}
      onTouchStart={handleTouchStart}
      onTouchMove={clearTimer}
      onTouchEnd={clearTimer}
      onTouchCancel={clearTimer}
    >
      <ItemContents
        item={item}
        onDelIcon={onDelIcon}
        onEditIcon={onEditIcon}
        onClickItem={handleItemClick}
      />
      {longPress && showMask && (
        <>
          <View className={b('mask-bottom')} onClick={hideMask} catchMove />
          <View className={b('general-mask')} onClick={hideMask}>
            <View className={b('mask-btn', { copy: true })} onClick={action(onLongCopy)}>
              <Text>{locale.generalShell.copyAddress}</Text>
            </View>
            {!item.defaultAddress && (
              <View className={b('mask-btn', { set: true })} onClick={action(onLongSet)}>
                <Text>{locale.generalShell.setDefault}</Text>
              </View>
            )}
            <View className={b('mask-btn', { del: true })} onClick={action(onLongDel)}>
              <Text>{locale.generalShell.deleteAddress}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

LongPressShell.displayName = 'NbAddressListLongPressShell'
