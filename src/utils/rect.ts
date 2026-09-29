import Taro from '@tarojs/taro'

export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export const EMPTY_RECT: Rect = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
}

/**
 * 取节点的尺寸与相对视口的位置 (等价于 Element.getBoundingClientRect)。
 * 小程序没有同步 DOM 测量, 一律走 SelectorQuery, 所以是异步的。
 * 节点不存在时返回 EMPTY_RECT, 不抛错。
 */
export function getRect(selector: string): Promise<Rect> {
  return new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(selector)
      .boundingClientRect()
      .exec((res) => resolve((res && (res[0] as Rect)) || EMPTY_RECT))
  })
}

/** 同 getRect, 取所有匹配节点 (按文档顺序)。 */
export function getRects(selector: string): Promise<Rect[]> {
  return new Promise((resolve) => {
    Taro.createSelectorQuery()
      .selectAll(selector)
      .boundingClientRect()
      .exec((res) => resolve((res && (res[0] as Rect[])) || []))
  })
}

/** 取可滚动节点的滚动位置。 */
export function getScrollOffset(
  selector: string
): Promise<{ scrollLeft: number; scrollTop: number }> {
  return new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(selector)
      .scrollOffset()
      .exec((res) =>
        resolve((res && res[0]) || { scrollLeft: 0, scrollTop: 0 })
      )
  })
}

/** 屏幕宽度 (px)。替代 document.body.clientWidth。 */
export function getWindowWidth(): number {
  try {
    return Taro.getWindowInfo().windowWidth
  } catch {
    return Taro.getSystemInfoSync().windowWidth
  }
}
