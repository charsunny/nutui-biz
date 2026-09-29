import { describe, expect, test } from 'bun:test'
import {
  calcEcardMoney,
  getEcardItemWidth,
  getEcardPrice,
  normalizeEcardCustomValue,
} from '../src/packages/ecard/utils'

describe('normalizeEcardCustomValue', () => {
  test('去掉非数字字符', () => {
    expect(normalizeEcardCustomValue('1a2.3', 1, 9999)).toBe(123)
    expect(normalizeEcardCustomValue('-50', 1, 9999)).toBe(50)
  })

  test('空输入保持为空', () => {
    expect(normalizeEcardCustomValue('', 1, 9999)).toBe('')
    expect(normalizeEcardCustomValue('abc', 1, 9999)).toBe('')
    expect(normalizeEcardCustomValue(undefined, 1, 9999)).toBe('')
  })

  test('限制在 [min, max]', () => {
    expect(normalizeEcardCustomValue('99999', 1, 9999)).toBe(9999)
    expect(normalizeEcardCustomValue('0', 1, 9999)).toBe(1)
    expect(normalizeEcardCustomValue('5', 10, 100)).toBe(10)
    expect(normalizeEcardCustomValue(50, 10, 100)).toBe(50)
  })
})

describe('calcEcardMoney', () => {
  test('面值 × 数量, 无浮点误差', () => {
    expect(calcEcardMoney(10, 3)).toBe(30)
    expect(calcEcardMoney(0.1, 3)).toBe(0.3)
    expect(calcEcardMoney('19.9', 3)).toBe(59.7)
  })

  test('面值或数量为空时为 0', () => {
    expect(calcEcardMoney('', 3)).toBe(0)
    expect(calcEcardMoney(10, 0)).toBe(0)
    expect(calcEcardMoney(undefined, 1)).toBe(0)
  })
})

describe('getEcardPrice', () => {
  const list = [{ price: 10 }, { price: 20 }]

  test('固定面值', () => {
    expect(getEcardPrice(list, 1, '')).toBe(20)
    expect(getEcardPrice(list, 5, 30)).toBe(0)
    expect(getEcardPrice([], 0, '')).toBe(0)
  })

  test('其它面值', () => {
    expect(getEcardPrice(list, -1, 35)).toBe(35)
    expect(getEcardPrice(list, -1, '')).toBe(0)
  })
})

describe('getEcardItemWidth', () => {
  test('按每行数量计算宽度百分比', () => {
    expect(getEcardItemWidth(2)).toBe(48)
    expect(getEcardItemWidth(3)).toBe(32)
    expect(getEcardItemWidth(undefined)).toBe(48)
    expect(getEcardItemWidth(0)).toBe(48)
  })
})
