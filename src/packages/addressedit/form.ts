// AddressEdit / ReceiveInvoiceEdit 表单的纯逻辑 (不依赖 Taro, 便于单测)。

/** 表单里的地址字段, 顺序即渲染顺序 */
export type AddressFormField = 'name' | 'tel' | 'region' | 'address'

export const ADDRESS_FORM_FIELDS: AddressFormField[] = ['name', 'tel', 'region', 'address']

const isEmpty = (val: unknown) => val === undefined || val === null || val === ''

/** 手机号输入: 只保留数字, 最多 11 位 */
export const normalizeTel = (val: string | undefined | null): string =>
  String(val ?? '')
    .replace(/[^0-9]/g, '')
    .slice(0, 11)

/** 必填但为空的字段 (按 fields 顺序) */
export const getMissingFields = (
  form: Record<string, unknown>,
  required: string[],
  fields: string[] = ADDRESS_FORM_FIELDS
): string[] => fields.filter((key) => required.includes(key) && isEmpty(form[key]))

/** 字段有值后, 从错误列表中移除 */
export const clearFieldError = (errors: string[], field: string, value: unknown): string[] =>
  isEmpty(value) ? errors : errors.filter((key) => key !== field)

/** 取 `${field}Text` / `${field}Placeholder` / `${field}ErrorMsg` 形式的文案 */
export const fieldText = (
  texts: Record<string, unknown>,
  field: string,
  suffix: 'Text' | 'Placeholder' | 'ErrorMsg'
): string => {
  const val = texts[`${field}${suffix}`]
  return isEmpty(val) ? '' : String(val)
}
