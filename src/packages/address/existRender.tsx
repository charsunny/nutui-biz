import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { Check, Location } from '@nutui/icons-react-taro'
import bem from '../../utils/bem'
import { formatExistAddress } from './region'
import type { AddressList } from './type'

export interface ExistRenderProps {
  existAddress: AddressList[]
  defaultIcon: ReactNode
  selectedIcon: ReactNode
  isShowCustomAddress: boolean
  customAndExistTitle: ReactNode
  onSelect: (index: number) => void
  onSwitchModule: () => void
}

export const ExistRender: FunctionComponent<ExistRenderProps> = ({
  existAddress,
  defaultIcon,
  selectedIcon,
  isShowCustomAddress,
  customAndExistTitle,
  onSelect,
  onSwitchModule,
}) => {
  const b = bem('address')

  const renderIcon = (item: AddressList) => {
    const custom = item.selectedAddress ? selectedIcon : defaultIcon
    return (
      <View className={b('exist-item-icon', { active: item.selectedAddress })}>
        {custom || (item.selectedAddress ? <Check size={13} /> : <Location size={13} />)}
      </View>
    )
  }

  return (
    <View className={b('exist')}>
      <ScrollView className={b('exist-group')} scrollY>
        {existAddress.map((item, index) => (
          <View
            key={`${item.id ?? index}`}
            className={b('exist-item', { active: item.selectedAddress })}
            onClick={() => onSelect(index)}
          >
            {renderIcon(item)}
            <View className={b('exist-item-info')}>
              {item.name && item.phone && (
                <View className={b('exist-item-top')}>
                  <Text className={b('exist-item-name')}>{item.name}</Text>
                  <Text className={b('exist-item-phone')}>{item.phone}</Text>
                </View>
              )}
              <Text className={b('exist-item-address')}>{formatExistAddress(item)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {isShowCustomAddress && (
        <View className={b('choose-other')}>
          <Button block type="primary" onClick={onSwitchModule}>
            {customAndExistTitle}
          </Button>
        </View>
      )}
    </View>
  )
}

ExistRender.displayName = 'NbAddressExistRender'
