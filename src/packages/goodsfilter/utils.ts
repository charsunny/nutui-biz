// GoodsFilter 的纯状态逻辑 (无 Taro 依赖, 便于单测)。所有函数都不修改入参。

export type FilterId = number | string

export interface GoodsFilterValue {
  id?: FilterId
  name?: string
  [key: string]: any
}

export interface GoodsFilterPriceRange {
  low: string
  high: string
  desc: string
  id?: FilterId
  extra?: any
}

export interface GoodsFilterAttrGroup {
  title: string
  id: FilterId
  values: GoodsFilterValue[]
  [key: string]: any
}

/** 某一类商品属性的选中状态 */
export interface GoodsFilterAttrSelection {
  id: FilterId
  values: FilterId[]
  isExpand?: boolean
}

export type GoodsFilterAttrsState = Record<string, GoodsFilterAttrSelection>

export interface GoodsFilterPrice {
  low: FilterId
  high: FilterId
}

export interface GoodsFilterSelectData {
  filterAttrs?: GoodsFilterValue[]
  goodsAttrs?: GoodsFilterAttrSelection[]
  price?: Partial<GoodsFilterPrice>
}

export interface GoodsFilterResult {
  address: string
  price: GoodsFilterPrice
  filterAttrs: GoodsFilterValue[]
  goodsAttrs: GoodsFilterAttrSelection[]
}

export interface GoodsFilterState {
  filterAttrs: GoodsFilterValue[]
  goodsAttrs: GoodsFilterAttrsState
}

export const EMPTY_PRICE_RANGE: GoodsFilterPriceRange = {
  low: '',
  high: '',
  desc: '',
  id: '',
  extra: '',
}

/** 顶部筛选项 (仅看有货 / 京东物流 ...) 的多选切换 */
export function toggleFilterAttr(
  selected: GoodsFilterValue[],
  attr: GoodsFilterValue
): { next: GoodsFilterValue[]; selected: boolean } {
  const idx = selected.findIndex((item) => item.id === attr.id)
  if (idx !== -1) {
    const next = selected.slice()
    next.splice(idx, 1)
    return { next, selected: false }
  }
  return { next: [...selected, attr], selected: true }
}

export function isFilterAttrSelected(
  selected: GoodsFilterValue[],
  attr: GoodsFilterValue
): boolean {
  return selected.some((item) => item.id === attr.id)
}

/** 商品属性值的多选切换 */
export function toggleGoodsAttrValue(
  state: GoodsFilterAttrsState,
  groupId: FilterId,
  valueId: FilterId
): GoodsFilterAttrsState {
  const key = String(groupId)
  const current = state[key]
  if (!current) {
    return { ...state, [key]: { id: groupId, values: [valueId] } }
  }
  const has = current.values.indexOf(valueId) !== -1
  return {
    ...state,
    [key]: {
      ...current,
      values: has
        ? current.values.filter((v) => v !== valueId)
        : [...current.values, valueId],
    },
  }
}

/** 展开 / 收起某一类商品属性 */
export function toggleGoodsAttrExpand(
  state: GoodsFilterAttrsState,
  groupId: FilterId
): GoodsFilterAttrsState {
  const key = String(groupId)
  const current = state[key] || { id: groupId, values: [] }
  return { ...state, [key]: { ...current, isExpand: !current.isExpand } }
}

export function isGoodsAttrExpanded(
  state: GoodsFilterAttrsState,
  groupId: FilterId
): boolean {
  return !!state[String(groupId)]?.isExpand
}

export function isGoodsAttrSelected(
  state: GoodsFilterAttrsState,
  groupId: FilterId,
  valueId: FilterId
): boolean {
  const current = state[String(groupId)]
  return !!current && current.values.indexOf(valueId) !== -1
}

/** 某一类属性已选值的名称, 逗号拼接 (按属性值原始顺序) */
export function getSelectedNames(
  values: GoodsFilterValue[],
  selection?: GoodsFilterAttrSelection
): string {
  if (!selection || !selection.values.length) return ''
  return values
    .filter((v) => v.id !== undefined && selection.values.indexOf(v.id) !== -1)
    .map((v) => v.name)
    .join(',')
}

/** 收起时只展示 maxLine 行 (每行 perRow 个) */
export function getVisibleValues<T>(
  values: T[],
  isExpand: boolean,
  maxLine: number,
  perRow = 3
): T[] {
  if (isExpand) return values
  const count = Math.max(0, Math.floor(maxLine)) * perRow
  return values.slice(0, count)
}

/** 推荐价格区间补全默认字段, id 缺省为序号 */
export function normalizePriceRanges(
  ranges?: Partial<GoodsFilterPriceRange>[]
): GoodsFilterPriceRange[] {
  return (ranges || []).map((range, index) => ({
    low: '',
    high: '',
    desc: '',
    extra: {},
    id: index,
    ...range,
  }))
}

/** 价格输入只保留数字 */
export function sanitizePriceInput(value: string | number | undefined): string {
  if (value === undefined || value === null) return ''
  return String(value).replace(/\D+/g, '')
}

/** 最低价大于最高价时交换 (任一为空时不交换) */
export function normalizePrice(
  low: FilterId,
  high: FilterId
): GoodsFilterPrice {
  if (low !== '' && high !== '' && Number(low) > Number(high)) {
    return { low: high, high: low }
  }
  return { low, high }
}

/** selectData (回显数据) → 内部状态 */
export function selectDataToState(
  selectData?: GoodsFilterSelectData
): GoodsFilterState {
  const goodsAttrs: GoodsFilterAttrsState = {}
  ;(selectData?.goodsAttrs || []).forEach((item) => {
    goodsAttrs[String(item.id)] = {
      ...item,
      values: (item.values || []).slice(),
    }
  })
  return {
    filterAttrs: (selectData?.filterAttrs || []).slice(),
    goodsAttrs,
  }
}

/** 点击"确定"时回传的结果 */
export function buildGoodsFilterResult(
  state: GoodsFilterState,
  price: GoodsFilterPrice,
  address: string
): GoodsFilterResult {
  return {
    address,
    price: normalizePrice(price.low, price.high),
    filterAttrs: state.filterAttrs.slice(),
    goodsAttrs: Object.keys(state.goodsAttrs).map((key) => ({
      ...state.goodsAttrs[key],
      values: state.goodsAttrs[key].values.slice(),
    })),
  }
}
