/**
 * 配送时间选择的纯逻辑 (不依赖 Taro / React 组件), 供 Delivery 与三个时间子组件共用。
 */
import type { numericProp } from '../../utils/props'
import { ACTIVEKEY } from './types'
import type {
  DateTimeAccurateType,
  DateTimesType,
  DateTimeType,
  DateType,
  DeliveryData,
  DeliveryTypes,
} from './types'

/** 展示配送时间的配送方式 label */
export const DEFAULT_DELIVERY_TYPE = 'jd'
/** 配送方式 / 配送时间标签的最大数量 */
export const MAX_COUNT = 3

/** activeKey 是否是有效值 (undefined / '' / 9999 视为未指定) */
export const isActiveKey = (key?: numericProp | null): key is numericProp =>
  key !== undefined && key !== null && key !== '' && String(key) !== String(ACTIVEKEY)

export const sameKey = (a?: numericProp | null, b?: numericProp | null) =>
  a !== undefined && a !== null && b !== undefined && b !== null && String(a) === String(b)

/** 第一个可选项; 全部禁用时返回第一个 */
export function firstEnabled<T extends { disabled?: boolean }>(list?: T[]): T | undefined {
  if (!list || !list.length) return undefined
  return list.find((item) => !item.disabled) ?? list[0]
}

/** 节点 (任意层级) 下是否有 selected 的时间 */
export function hasSelected(node?: DateTimesType): boolean {
  if (!node) return false
  if ((node as DateType).selected) return true
  const children = (node as DateTimeType).children as DateTimesType[] | undefined
  return Array.isArray(children) && children.some((child) => hasSelected(child))
}

// ---- DeliveryDate ----

/** DeliveryDate 当前选中的项: activeKey 命中 > selected > 第一个可选 */
export function resolveDateItem(data?: DateType[], activeKey?: numericProp): DateType | undefined {
  if (!data || !data.length) return undefined
  if (isActiveKey(activeKey)) {
    const hit = data.find((item) => sameKey(item.label, activeKey))
    if (hit) return hit
  }
  return data.find((item) => item.selected) ?? firstEnabled(data)
}

// ---- DeliveryDateTime / DeliveryDateTimeAccurate ----

/** 左侧日期面板: activeKey 命中 > 含 selected 的面板 > 第一个 */
export function resolvePanel<T extends DateTimeType | DateTimeAccurateType>(
  data?: T[],
  activeKey?: numericProp
): T | undefined {
  if (!data || !data.length) return undefined
  if (isActiveKey(activeKey)) {
    const hit = data.find((item) => sameKey(item.label, activeKey))
    if (hit) return hit
  }
  return data.find((item) => hasSelected(item)) ?? data[0]
}

/** DeliveryDateTime 某个面板里选中的时间: selected > 第一个可选 */
export function resolveDateTimeItem(panel?: DateTimeType): DateType | undefined {
  const children = panel?.children ?? []
  return children.find((item) => item.selected) ?? firstEnabled(children)
}

/** DeliveryDateTimeAccurate 某个面板里选中的分组与时间: selected > 第一个可选 */
export function resolveAccurateItem(
  panel?: DateTimeAccurateType
): { group: DateTimeType; item: DateType } | undefined {
  const groups = panel?.children ?? []
  for (const group of groups) {
    const item = (group.children ?? []).find((sub) => sub.selected)
    if (item) return { group, item }
  }
  for (const group of groups) {
    const item = (group.children ?? []).find((sub) => !sub.disabled)
    if (item) return { group, item }
  }
  const group = groups.find((g) => g.children && g.children.length)
  return group ? { group, item: group.children[0] } : undefined
}

/** DeliveryDateTime onSelect 的回调数据: 面板 + 仅含选中时间的 children */
export const toDateTimeSelection = (panel: DateTimeType, item: DateType): DateTimeType => ({
  ...panel,
  children: [item],
})

/** DeliveryDateTimeAccurate onSelect 的回调数据: 面板 + 选中分组 + 选中时间 */
export const toAccurateSelection = (
  panel: DateTimeAccurateType,
  group: DateTimeType,
  item: DateType
): DateTimeAccurateType => ({
  ...panel,
  children: [{ ...group, children: [{ ...item }] }],
})

// ---- Delivery ----

/** 某个配送时间 tab 的初始选中值 (与子组件默认高亮的项一致) */
export function initialSelection(data: DeliveryData): DateTimesType | null {
  switch (data.type) {
    case 'date':
      return resolveDateItem(data.times as DateType[]) ?? null
    case 'date-time': {
      const panel = resolvePanel(data.times as DateTimeType[])
      const item = resolveDateTimeItem(panel)
      return panel && item ? toDateTimeSelection(panel, item) : null
    }
    case 'date-time-accurate': {
      const panel = resolvePanel(data.times as DateTimeAccurateType[])
      const hit = resolveAccurateItem(panel)
      return panel && hit ? toAccurateSelection(panel, hit.group, hit.item) : null
    }
    default:
      return null
  }
}

/** 选中值对应的左侧面板 label (date 类型没有面板, 返回选中项 label) */
export const selectionKey = (selection: DateTimesType | null | undefined) => selection?.label ?? ''

export interface DeliveryTimeState {
  /** 当前的配送时间 tab (DeliveryData.label) */
  deliveryTime: string
  /** 每个配送时间 tab 的选中值 */
  selections: Record<string, DateTimesType | null>
  /** 打开时传给子组件的 activeKey */
  activeKeys: Record<string, string>
}

/**
 * Delivery 打开时的初始状态:
 * - 当前 tab: 含 selected 时间的 tab (多个时取最后一个, 与旧版一致), 否则第一个可选 tab
 * - 每个 tab 的选中值: 见 initialSelection
 */
export function initDeliveryTime(deliveryDateData?: DeliveryData[]): DeliveryTimeState {
  const list = (deliveryDateData ?? []).slice(0, MAX_COUNT)
  const selections: Record<string, DateTimesType | null> = {}
  const activeKeys: Record<string, string> = {}
  let deliveryTime = ''
  list.forEach((data) => {
    const selection = initialSelection(data)
    selections[data.label] = selection
    activeKeys[data.label] = selectionKey(selection)
    if (!data.disabled && data.times.some((time) => hasSelected(time))) {
      deliveryTime = data.label
    }
  })
  if (!deliveryTime) deliveryTime = firstEnabled(list)?.label ?? ''
  return { deliveryTime, selections, activeKeys }
}

/** 初始配送方式: 有 label 为 preferred 的可选项则用它, 否则第一个可选项 */
export function initDeliveryType(
  deliveryTypes?: DeliveryTypes[],
  preferred: string = DEFAULT_DELIVERY_TYPE
): string {
  const list = (deliveryTypes ?? []).slice(0, MAX_COUNT)
  const hit = list.find((item) => item.label === preferred && !item.disabled)
  if (hit) return hit.label
  return firstEnabled(list)?.label ?? preferred
}
