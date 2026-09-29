import { describe, expect, test } from 'bun:test'
import {
  addSearchHistory,
  addSearchKeyword,
  normalizeKeyword,
  removeSearchHistory,
} from '../src/packages/searchhistory/utils'

const item = (key: string) => ({ key, url: '' })

describe('searchhistory list ops', () => {
  test('normalizeKeyword', () => {
    expect(normalizeKeyword('  手机 ')).toBe('手机')
    expect(normalizeKeyword('   ')).toBe('')
    expect(normalizeKeyword(undefined)).toBe('')
  })

  test('addSearchHistory puts item first and dedupes by key', () => {
    const list = [item('a'), item('b'), item('c')]
    expect(addSearchHistory(list, item('d')).map((i) => i.key)).toEqual(['d', 'a', 'b', 'c'])
    expect(addSearchHistory(list, item('b')).map((i) => i.key)).toEqual(['b', 'a', 'c'])
    // 不修改入参
    expect(list.map((i) => i.key)).toEqual(['a', 'b', 'c'])
  })

  test('addSearchHistory truncates to max', () => {
    const list = [item('a'), item('b'), item('c')]
    expect(addSearchHistory(list, item('d'), 3).map((i) => i.key)).toEqual(['d', 'a', 'b'])
  })

  test('addSearchKeyword trims and ignores blank keywords', () => {
    const list = [item('a')]
    expect(addSearchKeyword(list, '  b ').map((i) => i.key)).toEqual(['b', 'a'])
    const same = addSearchKeyword(list, '   ')
    expect(same).toEqual(list)
    expect(same).not.toBe(list)
  })

  test('removeSearchHistory removes by key', () => {
    const list = [item('a'), item('b'), item('a')]
    expect(removeSearchHistory(list, item('a')).map((i) => i.key)).toEqual(['b'])
    expect(removeSearchHistory(list, item('x'))).toHaveLength(3)
  })
})
