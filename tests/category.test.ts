import { describe, expect, test } from 'bun:test'
import {
  getActiveSectionIndex,
  getCenteredScrollOffset,
  toContentOffset,
} from '../src/packages/category/utils'

const sections = [
  { top: 0, height: 200 },
  { top: 200, height: 300 },
  { top: 500, height: 100 },
  { top: 600, height: 50 },
]

describe('category getActiveSectionIndex', () => {
  test('empty sections', () => {
    expect(getActiveSectionIndex(100, [])).toBe(0)
  })
  test('top of content activates first section', () => {
    expect(getActiveSectionIndex(0, sections)).toBe(0)
  })
  test('section stays active until its bottom passes the offset line', () => {
    expect(getActiveSectionIndex(189, sections)).toBe(0)
    expect(getActiveSectionIndex(190, sections)).toBe(1)
    expect(getActiveSectionIndex(250, sections)).toBe(1)
    expect(getActiveSectionIndex(495, sections)).toBe(2)
  })
  test('custom offset', () => {
    expect(getActiveSectionIndex(150, sections, { offset: 60 })).toBe(1)
  })
  test('past all sections returns last', () => {
    expect(getActiveSectionIndex(10000, sections)).toBe(3)
  })
  test('scrolled to bottom activates last section', () => {
    // viewport 300, content 650 -> max scrollTop 350
    expect(
      getActiveSectionIndex(350, sections, { viewportHeight: 300, contentHeight: 650 })
    ).toBe(3)
    expect(
      getActiveSectionIndex(300, sections, { viewportHeight: 300, contentHeight: 650 })
    ).toBe(1)
  })
  test('content shorter than viewport does not force last', () => {
    expect(
      getActiveSectionIndex(0, sections, { viewportHeight: 1000, contentHeight: 650 })
    ).toBe(0)
  })
})

describe('category offsets', () => {
  test('toContentOffset converts viewport coords', () => {
    expect(toContentOffset(350, 100, 40)).toBe(290)
  })
  test('getCenteredScrollOffset centers item', () => {
    expect(getCenteredScrollOffset(500, 50, 400)).toBe(325)
  })
  test('getCenteredScrollOffset never negative', () => {
    expect(getCenteredScrollOffset(50, 50, 400)).toBe(0)
  })
})
