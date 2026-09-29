import { describe, expect, test } from 'bun:test'
import {
  getContentPaddingKey,
  isScrollReachEnd,
  nextReachEndState,
} from '../src/packages/horizontalscrolling/utils'

describe('horizontalscrolling isScrollReachEnd', () => {
  test('not measured yet', () => {
    expect(isScrollReachEnd(100, 0, 500)).toBe(false)
  })
  test('content not overflowing', () => {
    expect(isScrollReachEnd(0, 300, 300)).toBe(false)
  })
  test('in the middle', () => {
    expect(isScrollReachEnd(100, 300, 600)).toBe(false)
  })
  test('at the end, with sub-pixel tolerance', () => {
    expect(isScrollReachEnd(300, 300, 600)).toBe(true)
    expect(isScrollReachEnd(299.5, 300, 600)).toBe(true)
    expect(isScrollReachEnd(290, 300, 600)).toBe(false)
    expect(isScrollReachEnd(290, 300, 600, 20)).toBe(true)
  })
})

describe('horizontalscrolling nextReachEndState', () => {
  test('fires only on arrival', () => {
    expect(nextReachEndState(false, true)).toEqual([true, true])
    expect(nextReachEndState(true, true)).toEqual([false, true])
    expect(nextReachEndState(true, false)).toEqual([false, false])
    expect(nextReachEndState(false, false)).toEqual([false, false])
  })
})

test('getContentPaddingKey', () => {
  expect(getContentPaddingKey('left')).toBe('paddingLeft')
  expect(getContentPaddingKey('right')).toBe('paddingRight')
})
