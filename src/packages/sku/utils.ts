// Sku 规格选择的纯逻辑, 不依赖 Taro, 便于单测与业务方复用。

export type SkuId = number | string

/** 某个规格值, 例如「亮黑色」 */
export interface SkuItem {
  id: SkuId
  name: string
  /** 是否选中 */
  active?: boolean
  /** 是否置灰 (不可选) */
  disable?: boolean
  [key: string]: any
}

/** 一个规格类目, 例如「颜色」 */
export interface SkuSpec {
  id: SkuId
  name: string
  list: SkuItem[]
  [key: string]: any
}

/** onSelectSku 回调参数 */
export interface SkuSelectInfo {
  sku: SkuItem
  skuIndex: number
  parentSku: SkuSpec
  parentIndex: number
}

/** 规格值是否可以点击选择 */
export const isSkuItemSelectable = (item?: SkuItem | null): item is SkuItem =>
  !!item && !item.disable

/** 规格值在界面上是否展示为选中 (置灰的选中项不算) */
export const isSkuItemActive = (item: SkuItem) => !!item.active && !item.disable

/**
 * 在第 parentIndex 个类目里选中 id 为 itemId 的规格值 (同类目单选)。
 * 不修改入参; 类目 / 规格值不存在或已置灰时原样返回。
 */
export function selectSkuItem(
  specs: SkuSpec[],
  parentIndex: number,
  itemId: SkuId
): SkuSpec[] {
  const spec = specs[parentIndex]
  if (!spec) return specs
  const target = spec.list.find((item) => item.id === itemId)
  if (!isSkuItemSelectable(target)) return specs
  return specs.map((s, index) =>
    index === parentIndex
      ? { ...s, list: s.list.map((item) => ({ ...item, active: item.id === itemId })) }
      : s
  )
}

/** 每个类目当前选中的规格值 (未选中为 undefined), 与 specs 一一对应 */
export function getSelectedSkuItems(specs: SkuSpec[]): Array<SkuItem | undefined> {
  return specs.map((spec) => spec.list.find(isSkuItemActive))
}

/** 是否每个类目都已选中 */
export function isSkuComplete(specs: SkuSpec[]): boolean {
  return specs.length > 0 && getSelectedSkuItems(specs).every(Boolean)
}

/**
 * 按「可售组合」重新计算每个规格值的 disable:
 * 规格值 X 可选 ⇔ 存在一个组合, 同时包含 X 与其它类目当前选中的规格值。
 * combos 的每一项是一个可售 SKU 包含的规格值 id 列表 (与类目顺序无关)。
 * 选中项若因此变为不可选, 会同时取消选中。不修改入参。
 */
export function resolveSkuAvailability(specs: SkuSpec[], combos: SkuId[][]): SkuSpec[] {
  const comboSets = combos.map((combo) => new Set<SkuId>(combo))
  const selected = specs.map((spec) => spec.list.find((item) => item.active))

  return specs.map((spec, specIndex) => {
    const others = selected.filter(
      (item, index): item is SkuItem => index !== specIndex && !!item
    )
    return {
      ...spec,
      list: spec.list.map((item) => {
        const available = comboSets.some(
          (set) => set.has(item.id) && others.every((other) => set.has(other.id))
        )
        return {
          ...item,
          disable: !available,
          active: available ? !!item.active : false,
        }
      }),
    }
  })
}

/** 步进器点击 +/- 后的值 (限制在 [min, max]) */
export function nextStepperValue(
  current: number | string,
  delta: number,
  min: number | string,
  max: number | string
): number {
  const next = Number(current) + delta
  return Math.min(Math.max(next, Number(min)), Number(max))
}
