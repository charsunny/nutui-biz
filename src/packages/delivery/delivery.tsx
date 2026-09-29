import { useEffect, useState } from 'react'
import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button, Popup, Radio } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { DeliveryDate, renderDeliveryText } from '../deliverydate/deliverydate'
import { DeliveryDateTime } from '../deliverydatetime/deliverydatetime'
import { DeliveryDateTimeAccurate } from '../deliverydatetimeaccurate/deliverydatetimeaccurate'
import type {
  DateTimeAccurateType,
  DateTimesType,
  DateTimeType,
  DateType,
  DeliveryData,
  DeliveryTypes,
} from './types'
import { DEFAULT_DELIVERY_TYPE, initDeliveryTime, initDeliveryType, MAX_COUNT } from './utils'
import type { DeliveryTimeState } from './utils'

export interface DeliveryProps extends IComponent {
  visible: boolean
  title: ReactNode
  /** 配送方式, 最多展示 3 个; label 为 `jd` 的配送方式下展示配送时间选择 */
  deliveryTypes: DeliveryTypes[]
  deliveryTimeTitle: ReactNode
  /** 配送时间数据, 最多展示 3 个 */
  deliveryDateData: DeliveryData[]
  buttonText: ReactNode
  /** Popup 的样式 */
  popStyle: CSSProperties
  /** Popup 的类名 */
  popClassName: string
  /** Popup 动画时长, 单位 ms */
  duration: number
  /** 点击遮罩或关闭图标时触发 */
  onCloseMask: () => void
  onClose: () => void
  /**
   * 点击确定按钮时触发。
   * item: 当前配送时间 tab 下选中的时间 (非 `jd` 配送方式时为 null);
   * type: 配送方式 label; deliveryTime: 配送时间 tab 的 label
   */
  onSure: (item: DateTimesType | null, type: string, deliveryTime: string) => void
  onDeliveryTypeChange: (label: string) => void
}

const EMPTY_DATA: DeliveryData[] = []
const DEFAULT_POP_STYLE: CSSProperties = { height: '80%' }

export const Delivery: FunctionComponent<Partial<DeliveryProps>> = ({
  visible = false,
  title,
  deliveryTypes,
  deliveryTimeTitle,
  deliveryDateData = EMPTY_DATA,
  buttonText,
  popStyle = DEFAULT_POP_STYLE,
  popClassName,
  duration = 300,
  className,
  style,
  children,
  onCloseMask,
  onClose,
  onSure,
  onDeliveryTypeChange,
}) => {
  const { locale } = useConfig()
  const b = bem('delivery')

  const types: DeliveryTypes[] = (
    deliveryTypes ?? [{ label: DEFAULT_DELIVERY_TYPE, text: locale.delivery.jdExpress }]
  ).slice(0, MAX_COUNT)
  const timeList = deliveryDateData.slice(0, MAX_COUNT)

  const [deliveryType, setDeliveryType] = useState(() => initDeliveryType(types))
  const [timeState, setTimeState] = useState<DeliveryTimeState>(() =>
    initDeliveryTime(deliveryDateData)
  )

  useEffect(() => {
    if (visible) setTimeState(initDeliveryTime(deliveryDateData))
  }, [visible, deliveryDateData])

  const typeItem = types.find((item) => item.label === deliveryType)
  const timeItem = timeList.find((item) => item.label === timeState.deliveryTime)
  const isTimeType = deliveryType === DEFAULT_DELIVERY_TYPE
  const showTimeSelect = isTimeType && !typeItem?.children

  const handleTypeChange = (value: string | number) => {
    const label = String(value)
    setDeliveryType(label)
    onDeliveryTypeChange?.(label)
  }

  const handleTimeChange = (value: string | number) => {
    setTimeState((prev) => ({ ...prev, deliveryTime: String(value) }))
  }

  const handleSelect = (item: DateTimesType) => {
    setTimeState((prev) => ({
      ...prev,
      selections: { ...prev.selections, [prev.deliveryTime]: item },
    }))
  }

  const handleSure = () => {
    const item = isTimeType ? timeState.selections[timeState.deliveryTime] ?? null : null
    onSure?.(item, deliveryType, timeState.deliveryTime)
    onClose?.()
  }

  // Popup 的 onClose 在 "内部关闭 (遮罩/关闭图标)" 和 "visible 置为 false" 时都会触发,
  // 后者由使用方主动关闭 (确定按钮已调用过 onClose), 不再重复通知。
  const handlePopupClose = () => {
    if (visible) onClose?.()
  }

  const handleMask = () => {
    onCloseMask?.()
    return true
  }

  const activeKey = timeItem ? timeState.activeKeys[timeItem.label] : undefined

  const renderTimeSelect = () => {
    if (!timeItem) return null
    switch (timeItem.type) {
      case 'date':
        return (
          <DeliveryDate
            data={timeItem.times as DateType[]}
            activeKey={activeKey}
            onSelect={handleSelect}
          />
        )
      case 'date-time':
        return (
          <DeliveryDateTime
            data={timeItem.times as DateTimeType[]}
            activeKey={activeKey}
            onSelect={handleSelect}
          />
        )
      case 'date-time-accurate':
        return (
          <DeliveryDateTimeAccurate
            data={timeItem.times as DateTimeAccurateType[]}
            activeKey={activeKey}
            onSelect={handleSelect}
          />
        )
      default:
        return null
    }
  }

  return (
    <Popup
      visible={visible}
      position="bottom"
      round
      closeable
      duration={duration}
      style={popStyle}
      className={classNames(b('popup'), popClassName)}
      onOverlayClick={handleMask}
      onCloseIconClick={handleMask}
      onClose={handlePopupClose}
    >
      <View className={classNames(b(), className)} style={style}>
        <View className={b('title')}>{title ?? locale.delivery.title}</View>
        <View className={b('content')}>
          <View className={b('content-type')}>
            <Radio.Group
              value={deliveryType}
              shape="button"
              direction="horizontal"
              onChange={handleTypeChange}
            >
              {types.map((item) => (
                <Radio
                  key={item.label}
                  value={item.label}
                  shape="button"
                  disabled={!!item.disabled}
                >
                  {renderDeliveryText(item.text, b('radio-text'))}
                </Radio>
              ))}
            </Radio.Group>
            {typeItem?.desc ? <View className={b('content-type-tips')}>{typeItem.desc}</View> : null}
          </View>
          {showTimeSelect ? (
            <View className={b('content-deliverytime')}>
              <View className={b('content-deliverytime-title')}>
                {deliveryTimeTitle ?? locale.delivery.deliveryTimeTitle}
              </View>
              <View className={b('content-deliverytime-tabs')}>
                <Radio.Group
                  value={timeState.deliveryTime}
                  shape="button"
                  direction="horizontal"
                  onChange={handleTimeChange}
                >
                  {timeList.map((item) => (
                    <Radio
                      key={item.label}
                      value={item.label}
                      shape="button"
                      disabled={!!item.disabled}
                    >
                      {renderDeliveryText(item.text, b('radio-text'))}
                    </Radio>
                  ))}
                </Radio.Group>
              </View>
              {timeItem?.desc ? (
                <View className={b('content-deliverytime-tips')}>{timeItem.desc}</View>
              ) : null}
            </View>
          ) : typeItem?.children ? (
            <View className={b('content-deliverytime')}>{typeItem.children}</View>
          ) : null}
        </View>
        {showTimeSelect && timeItem ? (
          <View className={b('select')}>{renderTimeSelect()}</View>
        ) : null}
        {children}
        {showTimeSelect && timeItem ? null : <View className={b('spacer')} />}
        <View className={b('btn')}>
          <Button type="primary" block onClick={handleSure}>
            {buttonText ?? locale.delivery.buttonText}
          </Button>
        </View>
      </View>
    </Popup>
  )
}

Delivery.displayName = 'NbDelivery'
