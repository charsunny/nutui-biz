// HorizontalScrolling 的纯计算逻辑 (无 Taro 依赖, 便于单测)

export type MaskPositionType = 'left' | 'right'

/**
 * 是否已经滚动到最右侧。
 * clientWidth 为 0 (尚未测量到容器宽度) 时一律返回 false。
 * threshold 用来吸收亚像素误差。
 */
export function isScrollReachEnd(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
  threshold = 1
): boolean {
  if (!clientWidth || !scrollWidth) return false
  if (scrollWidth <= clientWidth) return false
  return scrollLeft + clientWidth >= scrollWidth - threshold
}

/**
 * onScrollRight 只在"到达右侧"的那一刻触发一次, 离开后再次到达才会再触发。
 * 返回 [是否应触发, 新的到达状态]。
 */
export function nextReachEndState(
  prevReached: boolean,
  reached: boolean
): [boolean, boolean] {
  return [reached && !prevReached, reached]
}

/** 内容区靠遮罩一侧的内边距样式 key。 */
export function getContentPaddingKey(
  maskPosition: MaskPositionType
): 'paddingLeft' | 'paddingRight' {
  return maskPosition === 'left' ? 'paddingLeft' : 'paddingRight'
}
