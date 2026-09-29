import { describe, expect, test } from 'bun:test'
import {
  getSelectedSkuItems,
  isSkuComplete,
  isSkuItemActive,
  nextStepperValue,
  resolveSkuAvailability,
  selectSkuItem,
} from '../src/packages/sku/utils'
import type { SkuSpec } from '../src/packages/sku/utils'

const specs = (): SkuSpec[] => [
  {
    id: 'color',
    name: '颜色',
    list: [
      { id: 'black', name: '黑', active: true },
      { id: 'white', name: '白' },
      { id: 'red', name: '红', disable: true },
    ],
  },
  {
    id: 'size',
    name: '尺码',
    list: [
      { id: 'S', name: 'S' },
      { id: 'M', name: 'M', active: true },
      { id: 'L', name: 'L' },
    ],
  },
]

describe('selectSkuItem', () => {
  test('单选: 同类目只保留一个选中项', () => {
    const next = selectSkuItem(specs(), 0, 'white')
    expect(next[0].list.map((i) => !!i.active)).toEqual([false, true, false])
    expect(next[1].list.map((i) => !!i.active)).toEqual([false, true, false])
  })

  test('不修改入参, 未变动的类目保持引用', () => {
    const input = specs()
    const next = selectSkuItem(input, 0, 'white')
    expect(input[0].list[0].active).toBe(true)
    expect(input[0].list[1].active).toBeUndefined()
    expect(next).not.toBe(input)
    expect(next[1]).toBe(input[1])
  })

  test('置灰 / 不存在的规格值、越界类目: 原样返回', () => {
    const input = specs()
    expect(selectSkuItem(input, 0, 'red')).toBe(input)
    expect(selectSkuItem(input, 0, 'nope')).toBe(input)
    expect(selectSkuItem(input, 5, 'black')).toBe(input)
  })

  test('重复选中已选项幂等', () => {
    const next = selectSkuItem(specs(), 0, 'black')
    expect(next[0].list.map((i) => !!i.active)).toEqual([true, false, false])
  })
})

describe('getSelectedSkuItems / isSkuComplete', () => {
  test('返回每个类目的选中项', () => {
    expect(getSelectedSkuItems(specs()).map((i) => i?.id)).toEqual(['black', 'M'])
    expect(isSkuComplete(specs())).toBe(true)
  })

  test('置灰的选中项不算选中', () => {
    const s = specs()
    s[0].list[0].disable = true
    expect(isSkuItemActive(s[0].list[0])).toBe(false)
    expect(getSelectedSkuItems(s)[0]).toBeUndefined()
    expect(isSkuComplete(s)).toBe(false)
  })

  test('空规格不算选完', () => {
    expect(isSkuComplete([])).toBe(false)
  })
})

describe('resolveSkuAvailability', () => {
  const combos = [
    ['black', 'S'],
    ['black', 'M'],
    ['white', 'L'],
    ['red', 'M'],
  ]

  test('按其它类目的选中项计算可选性', () => {
    // 选中 黑 + M
    const next = resolveSkuAvailability(specs(), combos)
    // 颜色: 与 M 同时可售的是 黑、红
    expect(next[0].list.map((i) => !!i.disable)).toEqual([false, true, false])
    // 尺码: 与 黑 同时可售的是 S、M
    expect(next[1].list.map((i) => !!i.disable)).toEqual([false, false, true])
  })

  test('会覆盖入参里的 disable (以组合为准)', () => {
    const next = resolveSkuAvailability(specs(), combos)
    expect(next[0].list[2].disable).toBe(false) // 红 原本 disable, 与 M 组合可售
  })

  test('选中项变为不可售时取消选中', () => {
    // 颜色选 白 (只有 白+L), 尺码仍选 M
    const selected = selectSkuItem(specs(), 0, 'white')
    const next = resolveSkuAvailability(selected, combos)
    const white = next[0].list.find((i) => i.id === 'white')!
    // 白 与 M 无组合 → 置灰并取消选中
    expect(white.disable).toBe(true)
    expect(white.active).toBe(false)
    // 尺码按「白」计算: 只有 L 可选, M 被取消选中
    expect(next[1].list.map((i) => !!i.disable)).toEqual([true, true, false])
    expect(next[1].list.find((i) => i.id === 'M')!.active).toBe(false)
  })

  test('没有任何选中时, 只要出现在某个组合里就可选', () => {
    const none = specs().map((s) => ({ ...s, list: s.list.map((i) => ({ ...i, active: false })) }))
    const next = resolveSkuAvailability(none, [['black', 'S']])
    expect(next[0].list.map((i) => !!i.disable)).toEqual([false, true, true])
    expect(next[1].list.map((i) => !!i.disable)).toEqual([false, true, true])
  })

  test('组合与类目顺序无关, 支持数字 id', () => {
    const s: SkuSpec[] = [
      { id: 1, name: 'a', list: [{ id: 11, name: 'a1', active: true }, { id: 12, name: 'a2' }] },
      { id: 2, name: 'b', list: [{ id: 21, name: 'b1' }, { id: 22, name: 'b2' }] },
    ]
    const next = resolveSkuAvailability(s, [[21, 11], [22, 12]])
    expect(next[1].list.map((i) => !!i.disable)).toEqual([false, true])
    expect(next[0].list.map((i) => !!i.disable)).toEqual([false, false])
  })

  test('不修改入参', () => {
    const input = specs()
    resolveSkuAvailability(input, [])
    expect(input[0].list.map((i) => !!i.disable)).toEqual([false, false, true])
    expect(input[0].list[0].active).toBe(true)
  })
})

describe('nextStepperValue', () => {
  test('加减并限制在 [min, max]', () => {
    expect(nextStepperValue(2, 1, 1, 5)).toBe(3)
    expect(nextStepperValue(5, 1, 1, 5)).toBe(5)
    expect(nextStepperValue(1, -1, 1, 5)).toBe(1)
    expect(nextStepperValue('3', -1, '2', '7')).toBe(2)
  })
})
