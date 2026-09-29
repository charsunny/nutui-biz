import { createSelectorQuery } from '@tarojs/taro'
import { EMPTY_RECT } from './rect'
import type { Rect } from './rect'

/*
 * 与 ./rect 的 getRect / getRects 相同, 但用具名导入 createSelectorQuery。
 *
 * 原因: H5 端 @tarojs/taro 被替换为 @tarojs/taro-h5, 它的默认导出对象上没有
 * createSelectorQuery 等 API (只有具名导出), `Taro.createSelectorQuery()` 在 H5 会抛
 * "createSelectorQuery is not a function"。NutUI 3 自己也是用具名导入。
 * 小程序端具名导入同样可用。
 */

export function getRect(selector: string): Promise<Rect> {
  return new Promise((resolve) => {
    createSelectorQuery()
      .select(selector)
      .boundingClientRect()
      .exec((res) => resolve((res && (res[0] as Rect)) || EMPTY_RECT))
  })
}

export function getRects(selector: string): Promise<Rect[]> {
  return new Promise((resolve) => {
    createSelectorQuery()
      .selectAll(selector)
      .boundingClientRect()
      .exec((res) => resolve((res && (res[0] as Rect[])) || []))
  })
}
