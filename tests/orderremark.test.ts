import { describe, expect, test } from 'bun:test'
import { appendTag } from '../src/packages/orderremark/utils'

describe('appendTag', () => {
  test('first tag has no separator', () => {
    expect(appendTag('', '轻拿轻放', 50)).toEqual({ full: '轻拿轻放', value: '轻拿轻放' })
  })
  test('appends with full-width comma', () => {
    expect(appendTag('周末配送', '轻拿轻放', 50).value).toBe('周末配送，轻拿轻放')
  })
  test('truncates value to maxLength but reports the full string', () => {
    const r = appendTag('abcd', 'efgh', 6)
    expect(r.full).toBe('abcd，efgh')
    expect(r.value).toBe('abcd，e')
  })
  test('negative maxLength means unlimited', () => {
    expect(appendTag('a', 'b', -1).value).toBe('a，b')
  })
})
