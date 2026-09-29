import { describe, expect, test } from 'bun:test'
import {
  chunkPages,
  getItemWidth,
  getRowCount,
  getSlideBarOffset,
} from '../src/packages/quickenter/utils'

describe('quickenter chunkPages', () => {
  test('splits into pages', () => {
    expect(chunkPages([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })
  test('empty / undefined', () => {
    expect(chunkPages(undefined, 10)).toEqual([])
    expect(chunkPages([], 10)).toEqual([])
  })
  test('non-positive size keeps one page', () => {
    expect(chunkPages([1, 2, 3], 0)).toEqual([[1, 2, 3]])
  })
})

describe('quickenter getSlideBarOffset', () => {
  test('start', () => {
    expect(getSlideBarOffset(0, 750)).toBe(0)
  })
  test('proportional', () => {
    expect(getSlideBarOffset(150, 750)).toBe(20)
  })
  test('clamped to track', () => {
    // 2 页: 最大 scrollLeft = 375 / 750 -> 50%
    expect(getSlideBarOffset(375, 750)).toBe(50)
    expect(getSlideBarOffset(700, 750)).toBe(50)
    expect(getSlideBarOffset(-10, 750)).toBe(0)
  })
  test('unknown width', () => {
    expect(getSlideBarOffset(100, 0)).toBe(0)
  })
})

test('getItemWidth', () => {
  expect(getItemWidth(5)).toBe('20.00%')
  expect(getItemWidth('4')).toBe('25.00%')
  expect(getItemWidth(0)).toBe('100.00%')
})

test('getRowCount', () => {
  expect(getRowCount(10, 5, 2)).toBe(2)
  expect(getRowCount(3, 5, 2)).toBe(1)
  expect(getRowCount(30, '5', '1')).toBe(1)
})
