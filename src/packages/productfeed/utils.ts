// ProductFeed 的纯计算逻辑 (无 Taro 依赖, 便于单测)

export interface IndexedItem<T> {
  item: T
  /** 在原始 data 中的序号 */
  index: number
}

/** 双列瀑布流: 按原始顺序交替分到左右两列 (偶数在左, 奇数在右)。 */
export function splitColumns<T>(data: T[] | undefined): {
  left: IndexedItem<T>[]
  right: IndexedItem<T>[]
} {
  const left: IndexedItem<T>[] = []
  const right: IndexedItem<T>[] = []
  ;(data || []).forEach((item, index) => {
    ;(index % 2 === 0 ? left : right).push({ item, index })
  })
  return { left, right }
}

/** 商品 key: 优先取 item[itemKey], 缺失时回落到序号。 */
export function getItemKey(item: any, itemKey: string, index: number): string {
  const key = item && item[itemKey]
  return key === undefined || key === null ? `idx-${index}` : String(key)
}
