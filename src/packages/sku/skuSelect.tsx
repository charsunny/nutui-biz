import type { FunctionComponent } from 'react'
import { View, Text } from '@tarojs/components'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { isSkuItemActive, isSkuItemSelectable } from './utils'
import type { SkuItem, SkuSelectInfo, SkuSpec } from './utils'

export interface SkuSelectProps extends IComponent {
  sku: SkuSpec[]
  selectSku: (info: SkuSelectInfo) => void
}

export const SkuSelect: FunctionComponent<Partial<SkuSelectProps>> = ({
  sku = [],
  selectSku,
}) => {
  const b = bem('sku')

  const handleClick = (item: SkuItem, index: number, parent: SkuSpec, parentIndex: number) => {
    if (!isSkuItemSelectable(item)) return
    selectSku?.({ sku: item, skuIndex: index, parentSku: parent, parentIndex })
  }

  return (
    <View className={b('select')}>
      {sku.map((spec, parentIndex) => (
        <View className={b('select-item')} key={spec.id ?? parentIndex}>
          <View className={b('select-title')}>{spec.name}</View>
          <View className={b('select-list')}>
            {(spec.list || []).map((item, index) => (
              <View
                className={b('select-sku', {
                  active: isSkuItemActive(item),
                  disable: !!item.disable,
                })}
                key={item.id ?? item.name}
                onClick={() => handleClick(item, index, spec, parentIndex)}
              >
                <Text>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

SkuSelect.displayName = 'NbSkuSelect'
