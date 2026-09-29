import { useCallback, useRef, useState } from 'react'

/**
 * 驱动 ScrollView 的 scrollTop / scrollLeft 受控属性。
 *
 * ScrollView 只在该属性"变化"时才滚动: 用户手动滚走之后再设置同一个值不会生效。
 * 这里在目标值与上次相同时加一个极小偏移, 保证每次调用都能触发滚动。
 * `position` 记录真实滚动位置, 需要在 onScroll 里调用 `track` 更新。
 *
 * 注意 (Taro 4 H5): React 包装层每次更新都会把 scrollTop / scrollLeft 直接写回 DOM,
 * ScrollView 因子节点变化而重渲染时会被拉回到 `value`。会引起重渲染的操作之前先调用 `sync()`,
 * 让 `value` 等于当前真实位置。
 */
export function useScrollTo() {
  const [value, setValue] = useState(0)
  const position = useRef(0)

  const scrollTo = useCallback((target: number) => {
    const next = Math.max(0, target)
    setValue((prev) => (prev === next ? next + 0.01 : next))
    position.current = next
  }, [])

  const track = useCallback((pos: number) => {
    position.current = pos
  }, [])

  /** 把受控值同步为当前真实滚动位置 (不触发滚动) */
  const sync = useCallback(() => {
    setValue(position.current)
  }, [])

  return { value, scrollTo, position, track, sync }
}
