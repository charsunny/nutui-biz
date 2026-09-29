// 搜索历史列表的纯函数操作 (不修改入参, 返回新数组)。不依赖 Taro / React 运行时。
import type { ReactNode } from 'react'

export type IsearchItem = {
  /** 搜索关键词 */
  key: ReactNode
  /** 关键词跳转链接 */
  url: string
}

export interface SearchHistoryItemLike {
  key: unknown
}

/** 去掉首尾空白; 空关键词返回空串 */
export const normalizeKeyword = (keyword?: string | null): string =>
  String(keyword ?? '').trim()

/**
 * 把一条记录放到最前面: 已存在相同 key 的记录会先移除 (去重), 超出 max 条时截掉最旧的。
 */
export function addSearchHistory<T extends SearchHistoryItemLike>(
  list: readonly T[],
  item: T,
  max = Infinity
): T[] {
  const next = [item, ...list.filter((it) => it.key !== item.key)]
  return max > 0 && next.length > max ? next.slice(0, max) : next
}

/** 按关键词添加, 空白关键词不添加 (返回原列表的拷贝) */
export function addSearchKeyword(
  list: readonly IsearchItem[],
  keyword: string,
  max = Infinity
): IsearchItem[] {
  const key = normalizeKeyword(keyword)
  if (!key) return [...list]
  return addSearchHistory(list, { key, url: '' }, max)
}

/** 删除指定 key 的记录 */
export function removeSearchHistory<T extends SearchHistoryItemLike>(
  list: readonly T[],
  item: SearchHistoryItemLike
): T[] {
  return list.filter((it) => it.key !== item.key)
}
