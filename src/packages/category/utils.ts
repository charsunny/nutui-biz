// Category 的纯计算逻辑 (无 Taro 依赖, 便于单测)

export interface SectionOffset {
  /** 分区顶部相对滚动内容顶部的偏移 */
  top: number
  height: number
}

export interface ActiveSectionOptions {
  /** 分区底部离开视口顶部多少 px 之前仍算"当前分区", 默认 10 */
  offset?: number
  /** 滚动容器可视高度; 与 contentHeight 同时给出时, 滚到底会激活最后一个分区 */
  viewportHeight?: number
  /** 滚动内容总高度 (scrollHeight) */
  contentHeight?: number
}

/**
 * 根据滚动距离计算当前激活的分区序号: 第一个底部仍在视口顶部 (+offset) 之下的分区。
 * 滚动到底部时返回最后一个分区, 否则最后几个较矮的分区永远不会被激活。
 */
export function getActiveSectionIndex(
  scrollTop: number,
  sections: SectionOffset[],
  options: ActiveSectionOptions = {}
): number {
  if (!sections.length) return 0
  const { offset = 10, viewportHeight, contentHeight } = options
  if (
    viewportHeight &&
    contentHeight &&
    contentHeight > viewportHeight &&
    scrollTop + viewportHeight >= contentHeight - 1
  ) {
    return sections.length - 1
  }
  for (let i = 0; i < sections.length; i++) {
    const { top, height } = sections[i]
    if (top + height > scrollTop + offset) return i
  }
  return sections.length - 1
}

/**
 * 把视口坐标 (SelectorQuery 的 boundingClientRect) 换算成相对滚动内容的偏移。
 */
export function toContentOffset(
  itemStart: number,
  containerStart: number,
  currentScroll: number
): number {
  return itemStart - containerStart + currentScroll
}

/**
 * 让某一项在滚动容器中居中所需的滚动距离 (不小于 0)。
 */
export function getCenteredScrollOffset(
  itemOffset: number,
  itemSize: number,
  containerSize: number
): number {
  return Math.max(0, Math.round(itemOffset + itemSize / 2 - containerSize / 2))
}
