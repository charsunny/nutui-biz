import { useEffect, useState } from 'react'
import type { FunctionComponent } from 'react'
import { ScrollView, View } from '@tarojs/components'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import type { numericProp } from '../../utils/props'
import type { DateTimeType, DateType } from '../delivery/types'
import { resolveDateTimeItem, resolvePanel, toDateTimeSelection } from '../delivery/utils'
import { renderDeliveryText } from '../deliverydate/deliverydate'

export interface DeliveryDateTimeProps extends IComponent {
  data: DateTimeType[]
  /** 默认展示的左侧日期 label; 不传 / 9999 时取含 selected 项的日期, 否则第一个 */
  activeKey: numericProp
  /** 选中时间段后触发, 回调数据为所在日期, 其 children 只含选中的时间段 */
  onSelect: (item: DateTimeType) => void
}

interface Picked {
  panel?: string
  item?: string
}

const EMPTY: DateTimeType[] = []

const init = (data: DateTimeType[], activeKey?: numericProp) => {
  const panel = resolvePanel(data, activeKey)
  return { panel: panel?.label, picked: { panel: panel?.label, item: resolveDateTimeItem(panel)?.label } }
}

export const DeliveryDateTime: FunctionComponent<Partial<DeliveryDateTimeProps>> = ({
  data = EMPTY,
  activeKey,
  className,
  style,
  onSelect,
}) => {
  const b = bem('delivery-date-time')
  const [panelKey, setPanelKey] = useState(() => init(data, activeKey).panel)
  const [picked, setPicked] = useState<Picked>(() => init(data, activeKey).picked)

  useEffect(() => {
    const next = init(data, activeKey)
    setPanelKey(next.panel)
    setPicked(next.picked)
  }, [data, activeKey])

  const panel = data.find((item) => item.label === panelKey)

  const handleSelect = (item: DateType) => {
    if (item.disabled || !panel) return
    setPicked({ panel: panel.label, item: item.label })
    onSelect?.(toDateTimeSelection(panel, item))
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      <ScrollView scrollY className={b('pannel')}>
        {data.map((item) => (
          <View
            key={item.label}
            className={b('pannel-title', { current: item.label === panelKey })}
            onClick={() => setPanelKey(item.label)}
          >
            {renderDeliveryText(item.title, b('pannel-title-text'))}
          </View>
        ))}
      </ScrollView>
      <ScrollView scrollY className={b('detail')}>
        <View className={b('detail-list')}>
          {(panel?.children ?? []).map((item) => (
            <View
              key={item.label}
              className={b('detail-item', {
                current: picked.panel === panel?.label && picked.item === item.label,
                disable: !!item.disabled,
              })}
              onClick={() => handleSelect(item)}
            >
              {renderDeliveryText(item.text, b('detail-item-text'))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

DeliveryDateTime.displayName = 'NbDeliveryDateTime'
