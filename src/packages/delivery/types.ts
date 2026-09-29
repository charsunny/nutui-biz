import type { ReactNode } from 'react'

/**
 * Delivery / DeliveryDate / DeliveryDateTime / DeliveryDateTimeAccurate 共用的数据类型。
 * 只放类型与常量, 不依赖任何组件, 三个时间子组件与 Delivery 都从这里引入, 避免循环依赖。
 */

export interface DeliveryBaseType {
  label: string
  text: ReactNode
  selected?: boolean
  disabled?: boolean
}

/** 配送时间的三种展示形式 */
export type DeliveryDateType = 'date' | 'date-time' | 'date-time-accurate'

/** 单个可选时间 (deliveryDateType = 'date', 以及另外两种的最末级) */
export interface DateType extends DeliveryBaseType {}

/** 左侧日期 + 右侧时间段 */
export interface DateTimeType {
  label: string
  title: ReactNode
  children: DateType[]
}

/** 左侧日期 + 右侧分组 (上午/下午...) + 时间段 */
export interface DateTimeAccurateType {
  label: string
  title: ReactNode
  children: DateTimeType[]
}

export type DateTimesType = DateType | DateTimeType | DateTimeAccurateType

/** 配送方式 */
export interface DeliveryTypes extends DeliveryBaseType {
  desc?: ReactNode
  /** 自定义该配送方式下的内容 (替换默认的配送时间选择) */
  children?: ReactNode
}

/** 配送时间数据 */
export interface DeliveryData extends DeliveryTypes {
  type: DeliveryDateType
  times: DateTimesType[]
}

/** activeKey 的 "未指定" 占位值 (兼容旧版) */
export const ACTIVEKEY = 9999
