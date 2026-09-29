// QuickEnter 的纯计算逻辑 (无 Taro 依赖, 便于单测)

/** 按每屏数量切分成多屏。size <= 0 时整体作为一屏。 */
export function chunkPages<T>(data: T[] | undefined, size: number): T[][] {
  const list = data || []
  if (!list.length) return []
  const step = size > 0 ? Math.floor(size) : list.length
  const pages: T[][] = []
  for (let i = 0; i < list.length; i += step) {
    pages.push(list.slice(i, i + step))
  }
  return pages
}

/**
 * slide 模式自定义滚动条滑块的 left (百分比, 相对轨道宽度)。
 * 滑块宽度占轨道的 thumbPercent%, 位置按 scrollLeft / scrollWidth 等比映射并夹在轨道内。
 */
export function getSlideBarOffset(
  scrollLeft: number,
  scrollWidth: number,
  thumbPercent = 50
): number {
  if (!scrollWidth || scrollWidth <= 0) return 0
  const max = Math.max(0, 100 - thumbPercent)
  const value = (scrollLeft / scrollWidth) * 100
  return Math.min(max, Math.max(0, value))
}

/** 每个图标所占宽度 (百分比字符串)。 */
export function getItemWidth(columns: number | string): string {
  const n = Number(columns) > 0 ? Number(columns) : 1
  return `${(100 / n).toFixed(2)}%`
}

/** 首屏实际行数 (决定 swiper 高度估算)。 */
export function getRowCount(
  itemCount: number,
  columns: number | string,
  rows: number | string
): number {
  const c = Number(columns) > 0 ? Number(columns) : 1
  const r = Number(rows) > 0 ? Number(rows) : 1
  return Math.min(r, Math.ceil(itemCount / c))
}
