import { describe, expect, test } from 'bun:test'
import { formatCouponPrice } from '../src/packages/coupon/utils'

describe('formatCouponPrice', () => {
  test('keeps at most two decimals', () => {
    expect(formatCouponPrice('9.212')).toBe('9.21')
    expect(formatCouponPrice(9.5)).toBe('9.5')
    expect(formatCouponPrice('9.50')).toBe('9.5')
  })

  test('truncates to 5 characters', () => {
    expect(formatCouponPrice(123456)).toBe('12345')
    expect(formatCouponPrice('123.456')).toBe('123.4')
  })

  test('integers and non-numbers', () => {
    expect(formatCouponPrice(100)).toBe('100')
    expect(formatCouponPrice('8折')).toBe('8折')
    expect(formatCouponPrice('')).toBe('')
  })
})
