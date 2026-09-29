import type { FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { Checked } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'

export type InvoiceTitleStatus = 'pass' | 'veto' | 'approval'

export interface Idata {
  isSelected: boolean
  /** special: 增值税专用发票; normal: 电子普通发票 */
  type: 'special' | 'normal' | string
  /** 审批状态, 仅增值税专用发票展示 */
  status?: InvoiceTitleStatus | string
  isShowDefault: boolean
  title: string
  companyCode: string
  address: string
  companyPhone: string
  bankDeposit: string
  bankAccount: string
  isDelete: boolean
  isEdit: boolean
}

export interface InvoiceTitleListProps extends IComponent {
  data: Partial<Idata>
  otherOperate: ReactNode
  onClick: (data: Idata) => void
  onDelete: (data: Idata) => void
  onEdit: (data: Idata) => void
}

const DEFAULT_DATA: Idata = {
  isSelected: false,
  type: 'special',
  isShowDefault: false,
  title: '-',
  companyCode: '-',
  address: '-',
  companyPhone: '-',
  bankDeposit: '-',
  bankAccount: '-',
  isDelete: true,
  isEdit: true,
}

const INFO_FIELDS = ['companyCode', 'address', 'companyPhone', 'bankDeposit', 'bankAccount'] as const

export const InvoiceTitleList: FunctionComponent<Partial<InvoiceTitleListProps>> = ({
  className,
  style,
  data: dataProp,
  otherOperate,
  onClick,
  onDelete,
  onEdit,
}) => {
  const { locale } = useConfig()
  const t = locale.invoiceTitleList
  const b = bem('invoice-title-list')
  const data: Idata = { ...DEFAULT_DATA, ...dataProp }

  const statusText: Record<string, string> = {
    pass: t.statusPass,
    veto: t.statusVeto,
    approval: t.statusApproval,
  }
  const status = data.status || 'pass'
  const infoLabels: Record<(typeof INFO_FIELDS)[number], string> = {
    companyCode: t.companyCodeText,
    address: t.addressText,
    companyPhone: t.companyPhoneText,
    bankDeposit: t.bankDepositText,
    bankAccount: t.bankAccountText,
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      <View className={b('main')} onClick={() => onClick?.(data)}>
        {data.isSelected ? <Checked className={b('checked')} size={18} /> : null}
        <View className={b('body', { selected: data.isSelected })}>
          <View className={b('main-title')}>
            {data.isShowDefault ? <View className={b('main-default')}>{t.defaultText}</View> : null}
            <View className={b('main-text')}>{data.title}</View>
            {data.type === 'special' ? (
              <View className={b('main-status', { [status]: true })}>{statusText[status] ?? status}</View>
            ) : null}
          </View>
          {INFO_FIELDS.map((field) => (
            <View className={b('info')} key={field}>
              <View className={b('info-title')}>{infoLabels[field]}</View>
              <View className={b('info-content')}>{data[field]}</View>
            </View>
          ))}
        </View>
      </View>
      {otherOperate || data.isDelete || data.isEdit ? (
        <View className={b('buttons')}>
          {otherOperate}
          {data.isDelete ? (
            <Button className={b('button')} size="small" onClick={() => onDelete?.(data)}>
              {t.deleteText}
            </Button>
          ) : null}
          {data.isEdit ? (
            <Button className={b('button')} size="small" onClick={() => onEdit?.(data)}>
              {t.editText}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

InvoiceTitleList.displayName = 'NbInvoiceTitleList'
