import type { FunctionComponent } from 'react'
import { View, Text } from '@tarojs/components'
import type { ITouchEvent } from '@tarojs/components'
import { Del, Edit } from '@nutui/icons-react-taro'
import bem from '../../utils/bem'
import { useConfig } from '../configprovider'
import type { AddressListHandler, IDataInfo } from './types'

export interface ItemContentsProps {
  item: IDataInfo
  onDelIcon?: AddressListHandler
  onEditIcon?: AddressListHandler
  onClickItem?: AddressListHandler
}

export const ItemContents: FunctionComponent<ItemContentsProps> = ({
  item,
  onDelIcon,
  onEditIcon,
  onClickItem,
}) => {
  const { locale } = useConfig()
  const b = bem('address-list')

  const handle = (fn?: AddressListHandler) => (event: ITouchEvent) => {
    event.stopPropagation()
    fn?.(event, item)
  }

  return (
    <View className={b('item')} onClick={handle(onClickItem)}>
      <View className={b('item-info')}>
        <View className={b('item-contact')}>
          <Text className={b('item-name')}>{item.addressName}</Text>
          <Text className={b('item-tel')}>{item.phone}</Text>
          {item.defaultAddress && (
            <Text className={b('item-default')}>{locale.itemContents.default}</Text>
          )}
        </View>
        <View className={b('item-handle')}>
          <View className={b('item-del')} onClick={handle(onDelIcon)}>
            <Del size={16} />
          </View>
          <View className={b('item-edit')} onClick={handle(onEditIcon)}>
            <Edit size={16} />
          </View>
        </View>
      </View>
      <View className={b('item-addr')}>{item.fullAddress}</View>
    </View>
  )
}

ItemContents.displayName = 'NbAddressListItemContents'
