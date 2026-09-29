import { useEffect, useMemo, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { Address } from '../address/address'
import { REGION_KEYS, canAdvance, getLevels, parseRegionIds } from '../address/region'
import type {
  ChangeCallBack,
  CloseCallBack,
  CloseCallBackData,
  RegionData,
} from '../address/type'
import {
  ADDRESS_FORM_FIELDS,
  clearFieldError,
  fieldText,
  getMissingFields,
} from '../addressedit/form'
import type { AddressFormField } from '../addressedit/form'

export interface InvoiceInfo {
  name?: string
  tel?: string
  region?: string
  regionIds?: numericProp[]
  address?: string
  [key: string]: any
}

export interface InvoiceData {
  nameText?: string
  namePlaceholder?: string
  nameErrorMsg?: string
  telText?: string
  telPlaceholder?: string
  telErrorMsg?: string
  regionText?: string
  regionPlaceholder?: string
  regionErrorMsg?: string
  addressText?: string
  addressPlaceholder?: string
  addressErrorMsg?: string
  /** 必填项, 可选 name / tel / region / address, 默认全部必填 */
  required?: string[]
  /** 是否显示保存按钮, 默认 true */
  showSaveBtn?: boolean
  bottomText?: string
  [key: string]: any
}

export interface InvoiceAddressResult {
  addressSelect?: numericProp[]
  province?: RegionData[]
  city?: RegionData[]
  country?: RegionData[]
  town?: RegionData[]
  addressTitle?: string
  [key: string]: any
}

export interface ReceiveInvoiceEditProps extends IComponent {
  invoiceInfo: InvoiceInfo
  data: InvoiceData
  address: InvoiceAddressResult
  buttonProps?: Partial<ButtonProps>
  /** 表单与保存按钮之间的自定义内容 (如「设为默认」) */
  bottom?: ReactNode
  onChange?: (val: string, tag: string) => void
  onAddressChange?: (data: ChangeCallBack) => void
  /** 地址弹窗关闭时触发 */
  onAddressClose?: (data: CloseCallBack) => void
  /** 保存按钮事件 (校验通过后触发) */
  onSave?: (data: InvoiceInfo) => void
}

const EMPTY_INFO: InvoiceInfo = {}
const EMPTY_DATA: InvoiceData = {}
const EMPTY_ADDRESS: InvoiceAddressResult = {}

const initialForm = (info: InvoiceInfo): InvoiceInfo => ({
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
  ...info,
})

export const ReceiveInvoiceEdit: FunctionComponent<Partial<ReceiveInvoiceEditProps>> = (
  props
) => {
  const { locale } = useConfig()
  const {
    className,
    style,
    invoiceInfo = EMPTY_INFO,
    data = EMPTY_DATA,
    address = EMPTY_ADDRESS,
    buttonProps,
    bottom,
    onChange,
    onSave,
    onAddressChange,
    onAddressClose,
  } = props
  const b = bem('receive-invoice-edit')

  const texts = useMemo<InvoiceData>(
    () => ({ ...locale.receiveInvoiceEdit, ...data }),
    [locale, data]
  )
  const required = data.required ?? ADDRESS_FORM_FIELDS
  const showSaveBtn = data.showSaveBtn ?? true

  const infoKey = JSON.stringify(invoiceInfo)
  const dataKey = JSON.stringify(data)

  const [formData, setFormData] = useState<InvoiceInfo>(() => initialForm(invoiceInfo))
  const [errors, setErrors] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const [regionSelect, setRegionSelect] = useState<numericProp[]>(
    invoiceInfo.regionIds?.length ? invoiceInfo.regionIds : address.addressSelect ?? []
  )

  useEffect(() => {
    setFormData(initialForm(invoiceInfo))
    if (invoiceInfo.regionIds?.length) setRegionSelect(invoiceInfo.regionIds)
  }, [infoKey])

  useEffect(() => {
    setErrors([])
  }, [infoKey, dataKey])

  const updateField = (tag: string, val: string) => {
    setFormData((prev) => ({ ...prev, [tag]: val }))
    setErrors((prev) => clearFieldError(prev, tag, val))
    onChange?.(val, tag)
  }

  const handleAddressChange = (cal: ChangeCallBack) => {
    setErrors((prev) => prev.filter((key) => key !== 'region'))
    // 选到最后一级才关。不能按「下一级列表是否为空」判断: 业务方常在
    // onAddressChange 里按本次选择换上下一级列表, 此刻 props 里还是旧的 (首次为空),
    // 那样选完省就被关掉, 所在地区只剩一个省名。
    const levels = getLevels({ town: address.town ?? [] })
    if (!canAdvance(REGION_KEYS.indexOf(cal.custom), levels)) setVisible(false)
    onAddressChange?.(cal)
  }

  const handleAddressClose = (val: CloseCallBack) => {
    const res = val.data as CloseCallBackData
    if (res.addressStr) {
      const ids = parseRegionIds(res.addressIdStr)
      setFormData((prev) => ({ ...prev, region: res.addressStr, regionIds: ids }))
      setRegionSelect(ids)
    }
    onAddressClose?.(val)
    setVisible(false)
  }

  const save = () => {
    const missing = getMissingFields(formData, required)
    setErrors(missing)
    if (missing.length === 0) onSave?.(formData)
  }

  const renderField = (tag: AddressFormField) => {
    const label = fieldText(texts, tag, 'Text')
    const placeholder = fieldText(texts, tag, 'Placeholder')
    const value = String(formData[tag] ?? '')
    const hasError = errors.includes(tag)
    return (
      <View className={b('item', { error: hasError })} key={tag}>
        <View className={b('row')}>
          <View className={b('label')}>
            {required.includes(tag) && <Text className={b('required')}>*</Text>}
            <Text>{label}</Text>
          </View>
          {tag === 'region' ? (
            <View className={b('region')} onClick={() => setVisible(true)}>
              <Text className={b('region-text', { placeholder: !value })}>
                {value || placeholder}
              </Text>
              <ArrowRight className={b('region-arrow')} size={12} />
            </View>
          ) : (
            <Input
              className={b('input')}
              plain
              name={tag}
              value={value}
              placeholder={placeholder}
              type={tag === 'tel' ? 'number' : 'text'}
              onChange={(val) => updateField(tag, val)}
            />
          )}
        </View>
        {hasError && <View className={b('error')}>{fieldText(texts, tag, 'ErrorMsg')}</View>}
      </View>
    )
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      {ADDRESS_FORM_FIELDS.map(renderField)}
      <Address
        modelValue={visible}
        modelSelect={regionSelect}
        province={address.province ?? []}
        city={address.city ?? []}
        country={address.country ?? []}
        town={address.town ?? []}
        customAddressTitle={address.addressTitle ?? locale.address.selectRegion}
        onChange={handleAddressChange}
        onClose={handleAddressClose}
      />
      {bottom}
      {showSaveBtn && (
        <View className={b('bottom')}>
          <Button block type="primary" onClick={save} {...buttonProps}>
            {texts.bottomText}
          </Button>
        </View>
      )}
    </View>
  )
}

ReceiveInvoiceEdit.displayName = 'NbReceiveInvoiceEdit'
