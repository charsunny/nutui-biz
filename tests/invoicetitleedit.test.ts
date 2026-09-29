import { describe, expect, test } from 'bun:test'
import {
  INVOICE_TITLE_FIELDS,
  getInvoiceTitleFieldRules,
  isInvoiceTitleFieldReadOnly,
  isInvoiceTitleFieldRequired,
  validateInvoiceTitle,
} from '../src/packages/invoicetitleedit/utils'

const full = {
  title: '京东集团',
  companyCode: '123456ABCD',
  address: '北京市经开区',
  companyPhone: '010-12345678',
  bankDeposit: '中国银行',
  bankAccount: '12345678',
}

describe('invoice title rules', () => {
  test('special invoice requires everything except companyCode', () => {
    const required = INVOICE_TITLE_FIELDS.filter((f) => isInvoiceTitleFieldRequired(f, 'special'))
    expect(required).toEqual(['title', 'address', 'companyPhone', 'bankDeposit', 'bankAccount'])
  })

  test('normal invoice: personal only title, enterprise also companyCode', () => {
    expect(INVOICE_TITLE_FIELDS.filter((f) => isInvoiceTitleFieldRequired(f, 'normal', 'personal'))).toEqual(['title'])
    expect(INVOICE_TITLE_FIELDS.filter((f) => isInvoiceTitleFieldRequired(f, 'normal', 'enterprise'))).toEqual([
      'title',
      'companyCode',
    ])
  })

  test('companyCode is read-only for special invoice only', () => {
    expect(isInvoiceTitleFieldReadOnly('companyCode', 'special')).toBe(true)
    expect(isInvoiceTitleFieldReadOnly('companyCode', 'normal')).toBe(false)
    expect(isInvoiceTitleFieldReadOnly('title', 'special')).toBe(false)
  })

  test('rules carry required + whitespace + message', () => {
    expect(getInvoiceTitleFieldRules('address', 'special', 'personal', 'msg')).toEqual([
      { required: true, whitespace: true, message: 'msg' },
    ])
    expect(getInvoiceTitleFieldRules('address', 'normal', 'personal', 'msg')[0].required).toBe(false)
  })
})

describe('validateInvoiceTitle', () => {
  test('passes with full data', () => {
    expect(validateInvoiceTitle(full, 'special')).toEqual([])
    expect(validateInvoiceTitle({ ...full, titleType: 'enterprise' }, 'normal')).toEqual([])
  })

  test('reports missing / blank required fields in order', () => {
    expect(validateInvoiceTitle({}, 'special')).toEqual([
      'title',
      'address',
      'companyPhone',
      'bankDeposit',
      'bankAccount',
    ])
    expect(validateInvoiceTitle({ ...full, title: '   ', bankAccount: '' }, 'special')).toEqual([
      'title',
      'bankAccount',
    ])
  })

  test('normal invoice depends on titleType', () => {
    expect(validateInvoiceTitle({ title: 'x' }, 'normal')).toEqual([])
    expect(validateInvoiceTitle({ title: 'x', titleType: 'enterprise' }, 'normal')).toEqual(['companyCode'])
  })
})
