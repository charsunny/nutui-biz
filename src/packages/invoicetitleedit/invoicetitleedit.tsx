import { useEffect, useRef, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button, Form, Input, Radio } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { INVOICE_TITLE_FIELDS, getInvoiceTitleFieldRules, isInvoiceTitleFieldReadOnly } from './utils'
import type { InvoiceTitleField, InvoiceTitleType, invoiceType } from './utils'

export type { invoiceType, InvoiceTitleType, InvoiceTitleField }

export interface Idata {
  /** 抬头类型, 仅电子普通发票: personal / enterprise */
  titleType?: InvoiceTitleType | string
  title: string
  companyCode: string
  address: string
  companyPhone: string
  bankDeposit: string
  bankAccount: string
}

export interface InvoiceTitleEditProps extends IComponent {
  invoiceType: invoiceType
  bottom: ReactNode
  buttonProps: Partial<Omit<ButtonProps, 'type' | 'block'>>
  submitButtonText: string
  /** 提交按钮是否固定在页面底部 */
  submitFixed: boolean
  data: Partial<Idata>
  /** 校验通过时参数为表单值; 校验失败时参数为错误数组 (可用 Array.isArray 区分) */
  onSubmit: (arg: any) => void
  /** 发票抬头输入 */
  onInput: (value: string) => void
}

const toValues = (data: Partial<Idata> | undefined, type: invoiceType) => {
  const values: Record<string, string> = {}
  if (type === 'normal') values.titleType = data?.titleType || 'personal'
  INVOICE_TITLE_FIELDS.forEach((field) => {
    values[field] = data?.[field] ?? ''
  })
  return values
}

export const InvoiceTitleEdit: FunctionComponent<Partial<InvoiceTitleEditProps>> = ({
  className,
  style,
  invoiceType = 'special',
  bottom,
  buttonProps,
  submitButtonText,
  submitFixed = true,
  data,
  onSubmit,
  onInput,
}) => {
  const { locale } = useConfig()
  const t = locale.invoiceTitleEdit
  const b = bem('invoice-title-edit')
  const [form] = Form.useForm()
  const [titleType, setTitleType] = useState<string>(data?.titleType || 'personal')

  // data 变化时回填 (首次由 initialValues 负责)
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    form.setFieldsValue(toValues(data, invoiceType))
    setTitleType(data?.titleType || 'personal')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const labels: Record<InvoiceTitleField, [string, string]> = {
    title: [t.titleText, t.titlePlaceholder],
    companyCode: [t.companyCodeText, t.companyCodePlaceholder],
    address: [t.addressText, t.addressPlaceholder],
    companyPhone: [t.companyPhoneText, t.companyPhonePlaceholder],
    bankDeposit: [t.bankDepositText, t.bankDepositPlaceholder],
    bankAccount: [t.bankAccountText, t.bankAccountPlaceholder],
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      <Form
        form={form}
        labelPosition="left"
        initialValues={toValues(data, invoiceType)}
        onFinish={(values) => onSubmit?.(values)}
        onFinishFailed={(_values, errors) => onSubmit?.(errors)}
      >
        {invoiceType === 'normal' ? (
          <Form.Item label={t.titleTypeText} name="titleType">
            <Radio.Group
              direction="horizontal"
              shape="button"
              onChange={(v) => setTitleType(String(v))}
            >
              <Radio shape="button" value="personal">
                {t.personalText}
              </Radio>
              <Radio shape="button" value="enterprise">
                {t.enterpriseText}
              </Radio>
            </Radio.Group>
          </Form.Item>
        ) : null}
        {INVOICE_TITLE_FIELDS.map((field) => {
          const [label, placeholder] = labels[field]
          const readOnly = isInvoiceTitleFieldReadOnly(field, invoiceType)
          return (
            <Form.Item
              key={field}
              label={label}
              name={field}
              rules={getInvoiceTitleFieldRules(field, invoiceType, titleType, placeholder)}
            >
              <Input
                className={b('input')}
                placeholder={readOnly ? '' : placeholder}
                readOnly={readOnly}
                disabled={readOnly}
                onChange={field === 'title' ? (val) => onInput?.(val) : undefined}
              />
            </Form.Item>
          )
        })}
      </Form>
      {bottom}
      {submitFixed ? <View className={b('submit-placeholder')} /> : null}
      <View className={b('submit', { fixed: submitFixed })}>
        <Button
          type="primary"
          block
          {...buttonProps}
          onClick={() => form.submit()}
        >
          {submitButtonText || t.submitButtonText}
        </Button>
      </View>
    </View>
  )
}

InvoiceTitleEdit.displayName = 'NbInvoiceTitleEdit'
