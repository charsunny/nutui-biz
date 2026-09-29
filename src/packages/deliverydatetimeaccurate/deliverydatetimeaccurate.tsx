import { useEffect, useState } from 'react'
import type { FunctionComponent } from 'react'
import { ScrollView, View } from '@tarojs/components'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import type { numericProp } from '../../utils/props'
import type { DateTimeAccurateType, DateTimeType, DateType } from '../delivery/types'
import { resolveAccurateItem, resolvePanel, toAccurateSelection } from '../delivery/utils'
import { renderDeliveryText } from '../deliverydate/deliverydate'

export interface DeliveryDateTimeAccurateProps extends IComponent {
  data: DateTimeAccurateType[]
  /** 默认展示的左侧日期 label; 不传 / 9999 时取含 selected 项的日期, 否则第一个 */
  activeKey: numericProp
  /** 选中时间段后触发, 回调数据为所在日期 → 所在分组 → 选中的时间段 */
  onSelect: (item: DateTimeAccurateType) => void
}

interface Picked {
  panel?: string
  group?: string
  item?: string
}

const EMPTY: DateTimeAccurateType[] = []

const init = (data: DateTimeAccurateType[], activeKey?: numericProp) => {
  const panel = resolvePanel(data, activeKey)
  const hit = resolveAccurateItem(panel)
  return {
    panel: panel?.label,
    picked: { panel: panel?.label, group: hit?.group.label, item: hit?.item.label },
  }
}

export const DeliveryDateTimeAccurate: FunctionComponent<
  Partial<DeliveryDateTimeAccurateProps>
> = ({ data = EMPTY, activeKey, className, style, onSelect }) => {
  const b = bem('delivery-date-time-accurate')
  const [panelKey, setPanelKey] = useState(() => init(data, activeKey).panel)
  const [picked, setPicked] = useState<Picked>(() => init(data, activeKey).picked)

  useEffect(() => {
    const next = init(data, activeKey)
    setPanelKey(next.panel)
    setPicked(next.picked)
  }, [data, activeKey])

  const panel = data.find((item) => item.label === panelKey)

  const handleSelect = (group: DateTimeType, item: DateType) => {
    if (item.disabled || !panel) return
    setPicked({ panel: panel.label, group: group.label, item: item.label })
    onSelect?.(toAccurateSelection(panel, group, item))
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
          {(panel?.children ?? []).map((group) => (
            <View key={group.label} className={b('detail-item')}>
              <View className={b('detail-item-title')}>
                {renderDeliveryText(group.title, b('detail-item-title-text'))}
              </View>
              <View className={b('detail-item-times')}>
                {(group.children ?? []).map((item) => (
                  <View
                    key={item.label}
                    className={b('detail-item-time', {
                      current:
                        picked.panel === panel?.label &&
                        picked.group === group.label &&
                        picked.item === item.label,
                      disable: !!item.disabled,
                    })}
                    onClick={() => handleSelect(group, item)}
                  >
                    {renderDeliveryText(item.text, b('detail-item-time-text'))}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

DeliveryDateTimeAccurate.displayName = 'NbDeliveryDateTimeAccurate'
