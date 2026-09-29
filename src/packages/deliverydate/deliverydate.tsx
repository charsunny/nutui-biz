import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { ScrollView, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import type { numericProp } from '../../utils/props'
import type { DateType } from '../delivery/types'
import { resolveDateItem } from '../delivery/utils'

export interface DeliveryDateProps extends IComponent {
  data: DateType[]
  /** 当前选中项的 label; 不传 / 9999 时取 selected 项, 否则第一个可选项 */
  activeKey: numericProp
  onSelect: (item: DateType) => void
}

/** 字符串文案包一层 Text 以便省略; ReactNode 原样渲染 */
export const renderDeliveryText = (text: ReactNode, className: string) =>
  typeof text === 'string' || typeof text === 'number' ? (
    <Text className={className}>{text}</Text>
  ) : (
    text
  )

const EMPTY: DateType[] = []

export const DeliveryDate: FunctionComponent<Partial<DeliveryDateProps>> = ({
  data = EMPTY,
  activeKey,
  className,
  style,
  onSelect,
}) => {
  const b = bem('delivery-date')
  const [current, setCurrent] = useState(() => resolveDateItem(data, activeKey)?.label)

  useEffect(() => {
    setCurrent(resolveDateItem(data, activeKey)?.label)
  }, [data, activeKey])

  const handleSelect = (item: DateType) => {
    if (item.disabled) return
    setCurrent(item.label)
    onSelect?.(item)
  }

  return (
    <ScrollView scrollY className={classNames(b(), className)} style={style}>
      <View className={b('list')}>
        {data.map((item) => (
          <View
            key={item.label}
            className={b('item', {
              current: item.label === current,
              disable: !!item.disabled,
            })}
            onClick={() => handleSelect(item)}
          >
            {renderDeliveryText(item.text, b('item-text'))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

DeliveryDate.displayName = 'NbDeliveryDate'
