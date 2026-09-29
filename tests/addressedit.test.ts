import { describe, expect, test } from 'bun:test'
import {
  ADDRESS_FORM_FIELDS,
  clearFieldError,
  fieldText,
  getMissingFields,
  normalizeTel,
} from '../src/packages/addressedit/form'

describe('addressedit/form', () => {
  test('normalizeTel 只保留数字且最多 11 位', () => {
    expect(normalizeTel('131-4123 4567')).toBe('13141234567')
    expect(normalizeTel('131412345678')).toBe('13141234567')
    expect(normalizeTel('abc')).toBe('')
    expect(normalizeTel(undefined)).toBe('')
  })

  test('getMissingFields 按字段顺序返回必填但为空的字段', () => {
    const form = { name: '', tel: '131', region: undefined, address: 'x' }
    expect(getMissingFields(form, ADDRESS_FORM_FIELDS)).toEqual(['name', 'region'])
    expect(getMissingFields(form, ['tel', 'address'])).toEqual([])
    expect(getMissingFields(form, [])).toEqual([])
  })

  test('clearFieldError 有值时移除错误', () => {
    expect(clearFieldError(['name', 'tel'], 'name', 'a')).toEqual(['tel'])
    expect(clearFieldError(['name', 'tel'], 'name', '')).toEqual(['name', 'tel'])
  })

  test('fieldText 取 <field><Suffix> 文案', () => {
    const texts = { nameText: '收货人', namePlaceholder: '请输入', telErrorMsg: '必填' }
    expect(fieldText(texts, 'name', 'Text')).toBe('收货人')
    expect(fieldText(texts, 'name', 'Placeholder')).toBe('请输入')
    expect(fieldText(texts, 'tel', 'ErrorMsg')).toBe('必填')
    expect(fieldText(texts, 'region', 'Text')).toBe('')
  })
})
