import '@nutui/nutui-react-taro/dist/es/packages/form/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/input/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/radio/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/button/style/css'
import './invoicetitleedit.scss'

export { InvoiceTitleEdit } from './invoicetitleedit'
export type {
  InvoiceTitleEditProps,
  Idata as InvoiceTitleEditData,
  invoiceType as InvoiceTitleEditInvoiceType,
  InvoiceTitleType,
  InvoiceTitleField,
} from './invoicetitleedit'
export {
  INVOICE_TITLE_FIELDS,
  isInvoiceTitleFieldRequired,
  isInvoiceTitleFieldReadOnly,
  validateInvoiceTitle,
  getInvoiceTitleFieldRules,
} from './utils'
export { InvoiceTitleEdit as default } from './invoicetitleedit'
