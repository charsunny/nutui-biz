// InvoiceTitleEdit 的纯逻辑: 各字段是否必填 / 只读、提交前校验。不依赖 Taro / React。

export type invoiceType = 'special' | 'normal'
export type InvoiceTitleType = 'personal' | 'enterprise'

export type InvoiceTitleField =
  | 'title'
  | 'companyCode'
  | 'address'
  | 'companyPhone'
  | 'bankDeposit'
  | 'bankAccount'

export const INVOICE_TITLE_FIELDS: InvoiceTitleField[] = [
  'title',
  'companyCode',
  'address',
  'companyPhone',
  'bankDeposit',
  'bankAccount',
]

/**
 * 字段是否必填:
 *   title        总是必填
 *   companyCode  电子普通发票且抬头类型为企业时必填
 *   其余         增值税专用发票时必填
 */
export function isInvoiceTitleFieldRequired(
  field: InvoiceTitleField,
  type: invoiceType,
  titleType: InvoiceTitleType | string = 'personal'
): boolean {
  if (field === 'title') return true
  if (field === 'companyCode') return type === 'normal' && titleType === 'enterprise'
  return type === 'special'
}

/** 增值税专用发票的纳税人识别号不可修改 */
export const isInvoiceTitleFieldReadOnly = (field: InvoiceTitleField, type: invoiceType): boolean =>
  field === 'companyCode' && type === 'special'

const isBlank = (value: unknown) =>
  value === undefined || value === null || String(value).trim() === ''

/** 返回未填写的必填字段 (按 INVOICE_TITLE_FIELDS 顺序), 空数组表示校验通过。仅空白字符视为未填。 */
export function validateInvoiceTitle(
  values: Partial<Record<InvoiceTitleField | 'titleType', unknown>>,
  type: invoiceType
): InvoiceTitleField[] {
  const titleType = (values.titleType as string) || 'personal'
  return INVOICE_TITLE_FIELDS.filter(
    (field) => isInvoiceTitleFieldRequired(field, type, titleType) && isBlank(values[field])
  )
}

/** 生成 NutUI Form.Item 的 rules (async-validator 规则, whitespace 使仅空白视为未填) */
export function getInvoiceTitleFieldRules(
  field: InvoiceTitleField,
  type: invoiceType,
  titleType: InvoiceTitleType | string,
  message: string
) {
  return [{ required: isInvoiceTitleFieldRequired(field, type, titleType), whitespace: true, message }]
}
