import { describe, expect, test } from 'bun:test'
import {
  buildGoodsFilterResult,
  getSelectedNames,
  getVisibleValues,
  isFilterAttrSelected,
  isGoodsAttrExpanded,
  isGoodsAttrSelected,
  normalizePrice,
  normalizePriceRanges,
  sanitizePriceInput,
  selectDataToState,
  toggleFilterAttr,
  toggleGoodsAttrExpand,
  toggleGoodsAttrValue,
} from '../src/packages/goodsfilter/utils'

describe('goodsfilter filterAttrs', () => {
  test('toggle on and off without mutating input', () => {
    const initial = [{ id: 1, name: 'a' }]
    const added = toggleFilterAttr(initial, { id: 2, name: 'b' })
    expect(added.selected).toBe(true)
    expect(added.next.map((i) => i.id)).toEqual([1, 2])
    expect(initial.length).toBe(1)
    const removed = toggleFilterAttr(added.next, { id: 1, name: 'a' })
    expect(removed.selected).toBe(false)
    expect(removed.next.map((i) => i.id)).toEqual([2])
    expect(isFilterAttrSelected(removed.next, { id: 2 })).toBe(true)
    expect(isFilterAttrSelected(removed.next, { id: 1 })).toBe(false)
  })
})

describe('goodsfilter goodsAttrs', () => {
  test('toggle values immutably', () => {
    const s0 = {}
    const s1 = toggleGoodsAttrValue(s0, 1, 'x')
    expect(s0).toEqual({})
    expect(s1).toEqual({ '1': { id: 1, values: ['x'] } })
    const s2 = toggleGoodsAttrValue(s1, 1, 'y')
    expect(s2['1'].values).toEqual(['x', 'y'])
    expect(s1['1'].values).toEqual(['x'])
    const s3 = toggleGoodsAttrValue(s2, 1, 'x')
    expect(s3['1'].values).toEqual(['y'])
    expect(isGoodsAttrSelected(s3, 1, 'y')).toBe(true)
    expect(isGoodsAttrSelected(s3, 1, 'x')).toBe(false)
    expect(isGoodsAttrSelected(s3, 2, 'x')).toBe(false)
  })
  test('expand keeps selections', () => {
    const s1 = toggleGoodsAttrValue({}, 1, 'x')
    const s2 = toggleGoodsAttrExpand(s1, 1)
    expect(isGoodsAttrExpanded(s2, 1)).toBe(true)
    expect(s2['1'].values).toEqual(['x'])
    expect(isGoodsAttrExpanded(toggleGoodsAttrExpand(s2, 1), 1)).toBe(false)
    const s3 = toggleGoodsAttrExpand({}, 5)
    expect(s3['5']).toEqual({ id: 5, values: [], isExpand: true })
  })
  test('selected names follow value order', () => {
    const values = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ]
    expect(getSelectedNames(values, { id: 1, values: ['c', 'a'] })).toBe('A,C')
    expect(getSelectedNames(values, undefined)).toBe('')
  })
  test('visible values by maxLine', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8]
    expect(getVisibleValues(values, false, 2)).toEqual([1, 2, 3, 4, 5, 6])
    expect(getVisibleValues(values, false, 1)).toEqual([1, 2, 3])
    expect(getVisibleValues(values, true, 1)).toEqual(values)
  })
})

describe('goodsfilter price', () => {
  test('normalizePriceRanges fills defaults', () => {
    const r = normalizePriceRanges([{ low: '1', high: '2', desc: 'd' }, { low: '3', high: '4', desc: '', id: 'x' }])
    expect(r[0]).toEqual({ low: '1', high: '2', desc: 'd', extra: {}, id: 0 })
    expect(r[1].id).toBe('x')
    expect(normalizePriceRanges(undefined)).toEqual([])
  })
  test('sanitizePriceInput keeps digits only', () => {
    expect(sanitizePriceInput('12a3.4-')).toBe('1234')
    expect(sanitizePriceInput(undefined)).toBe('')
    expect(sanitizePriceInput(56)).toBe('56')
  })
  test('normalizePrice swaps only when both present', () => {
    expect(normalizePrice('300', '100')).toEqual({ low: '100', high: '300' })
    expect(normalizePrice('100', '300')).toEqual({ low: '100', high: '300' })
    expect(normalizePrice('100', '')).toEqual({ low: '100', high: '' })
    expect(normalizePrice('', '50')).toEqual({ low: '', high: '50' })
  })
})

describe('goodsfilter selectData / result', () => {
  test('selectDataToState copies input', () => {
    const selectData = {
      filterAttrs: [{ id: 0, name: '仅看有货' }],
      goodsAttrs: [{ id: 1, values: ['a'] }],
    }
    const state = selectDataToState(selectData)
    expect(state.goodsAttrs['1'].values).toEqual(['a'])
    state.goodsAttrs['1'].values.push('b')
    expect(selectData.goodsAttrs[0].values).toEqual(['a'])
    expect(selectDataToState(undefined)).toEqual({ filterAttrs: [], goodsAttrs: {} })
  })
  test('buildGoodsFilterResult', () => {
    const state = selectDataToState({ filterAttrs: [{ id: 2 }], goodsAttrs: [{ id: 1, values: ['a'] }] })
    expect(buildGoodsFilterResult(state, { low: '90', high: '10' }, '北京')).toEqual({
      address: '北京',
      price: { low: '10', high: '90' },
      filterAttrs: [{ id: 2 }],
      goodsAttrs: [{ id: 1, values: ['a'] }],
    })
  })
})
