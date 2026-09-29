import { expect, test } from 'bun:test'
import { getItemKey, splitColumns } from '../src/packages/productfeed/utils'

test('splitColumns alternates items and keeps original index', () => {
  const { left, right } = splitColumns(['a', 'b', 'c', 'd', 'e'])
  expect(left).toEqual([
    { item: 'a', index: 0 },
    { item: 'c', index: 2 },
    { item: 'e', index: 4 },
  ])
  expect(right).toEqual([
    { item: 'b', index: 1 },
    { item: 'd', index: 3 },
  ])
})

test('splitColumns handles empty', () => {
  expect(splitColumns(undefined)).toEqual({ left: [], right: [] })
})

test('getItemKey', () => {
  expect(getItemKey({ id: 3 }, 'id', 0)).toBe('3')
  expect(getItemKey({ id: 0 }, 'id', 5)).toBe('0')
  expect(getItemKey({}, 'id', 5)).toBe('idx-5')
  expect(getItemKey(undefined, 'id', 1)).toBe('idx-1')
})
