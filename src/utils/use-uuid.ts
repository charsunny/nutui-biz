import { useRef } from 'react'

let seed = 0

/**
 * 组件实例级的稳定 id, 用作 SelectorQuery 的选择器。
 * 不用 React.useId: 它生成的 `:r0:` 不是合法的 CSS 选择器。
 */
export function useUuid(prefix = 'nb'): string {
  const ref = useRef<string>()
  if (!ref.current) {
    seed += 1
    ref.current = `${prefix}-${seed}`
  }
  return ref.current
}
