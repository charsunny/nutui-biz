import { useEffect, useMemo, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Input, Switch, Toast } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { useUuid } from '../../utils/use-uuid'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { Address } from '../address/address'
import { parseRegionIds } from '../address/region'
import type {
  AddressType,
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
  normalizeTel,
} from './form'
import type { AddressFormField } from './form'

export type showErrorType = 'toast' | 'errorMsg'

export interface AddressInfo {
  name?: string
  tel?: string
  region?: string
  regionIds?: numericProp[]
  address?: string
  default?: boolean
  [key: string]: any
}

export interface AddressData {
  id?: numericProp
  nameText: string
  namePlaceholder: string
  nameErrorMsg: string
  telText: string
  telPlaceholder: string
  telErrorMsg: string
  regionText: string
  regionPlaceholder: string
  regionErrorMsg: string
  addressText: string
  addressPlaceholder: string
  addressErrorMsg: string
  isDefualtAddress?: boolean
  /** 必填项, 可选 name / tel / region / address, 默认全部必填 */
  isRequired?: string[]
  bottomText: string
  errorShowType?: showErrorType
  errorToastText?: string
  [key: string]: any
}

export interface AddressResult {
  addressSelect?: numericProp[]
  addressStr?: string
  province?: RegionData[]
  city?: RegionData[]
  country?: RegionData[]
  town?: RegionData[]
  addressTitle?: string
  type?: AddressType
  height?: string | number
}

export interface AddressEditProps extends IComponent {
  addressInfo: AddressInfo
  data: Partial<AddressData>
  address: AddressResult
  bottomInputTpl?: ReactNode
  showSave?: boolean
  showDefault?: boolean
  buttonProps?: Partial<ButtonProps>
  onChange?: (val: string, tag: string) => void
  onChangeAddress?: (data: ChangeCallBack) => void
  onCloseAddress?: (data: CloseCallBack) => void
  onSave?: (data: AddressInfo) => void
  onSwitch?: (state: boolean, data: AddressInfo) => void
}

const EMPTY_INFO: AddressInfo = {}
const EMPTY_DATA: Partial<AddressData> = {}
const EMPTY_ADDRESS: AddressResult = {}

const initialForm = (info: AddressInfo): AddressInfo => ({
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
  default: false,
  ...info,
})

export const AddressEdit: FunctionComponent<Partial<AddressEditProps>> = (props) => {
  const { locale } = useConfig()
  const {
    className,
    style,
    addressInfo = EMPTY_INFO,
    data = EMPTY_DATA,
    address = EMPTY_ADDRESS,
    bottomInputTpl,
    showSave = true,
    showDefault = true,
    buttonProps,
    onChange,
    onSave,
    onChangeAddress,
    onCloseAddress,
    onSwitch,
  } = props
  const b = bem('addressedit')
  const toastId = useUuid('nb-addressedit-toast')

  // 文案: locale 兜底, data 覆写
  const texts = useMemo<AddressData>(
    () => ({
      ...locale.addressedit,
      errorShowType: 'errorMsg',
      ...data,
    }),
    [locale, data]
  )
  const required = data.isRequired ?? ADDRESS_FORM_FIELDS

  const infoKey = JSON.stringify(addressInfo)
  const dataKey = JSON.stringify(data)

  const [formData, setFormData] = useState<AddressInfo>(() => initialForm(addressInfo))
  const [errors, setErrors] = useState<string[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [regionSelect, setRegionSelect] = useState<numericProp[]>(
    addressInfo.regionIds?.length ? addressInfo.regionIds : address.addressSelect ?? []
  )

  useEffect(() => {
    setFormData(initialForm(addressInfo))
    if (addressInfo.regionIds?.length) setRegionSelect(addressInfo.regionIds)
  }, [infoKey])

  useEffect(() => {
    if (!addressInfo.regionIds?.length && address.addressSelect) {
      setRegionSelect(address.addressSelect)
    }
  }, [address.addressSelect])

  useEffect(() => {
    setErrors([])
  }, [infoKey, dataKey])

  const updateField = (tag: string, val: string) => {
    const value = tag === 'tel' ? normalizeTel(val) : val
    setFormData((prev) => ({ ...prev, [tag]: value }))
    setErrors((prev) => clearFieldError(prev, tag, value))
    onChange?.(value, tag)
  }

  const handleChangeAddress = (cal: ChangeCallBack) => {
    setErrors((prev) => prev.filter((key) => key !== 'region'))
    if (cal.next === 'town') setShowPopup(false)
    onChangeAddress?.(cal)
  }

  const handleCloseAddress = (val: CloseCallBack) => {
    const res = val.data as CloseCallBackData
    if (res.addressStr) {
      const ids = parseRegionIds(res.addressIdStr)
      setFormData((prev) => ({ ...prev, region: res.addressStr, regionIds: ids }))
      setRegionSelect(ids)
      setErrors((prev) => prev.filter((key) => key !== 'region'))
    }
    onCloseAddress?.(val)
    setShowPopup(false)
  }

  const save = () => {
    const missing = getMissingFields(formData, required)
    setErrors(missing)
    if (missing.length === 0) {
      onSave?.(formData)
      return
    }
    if (texts.errorShowType === 'toast') {
      Toast.show(toastId, { content: texts.errorToastText, icon: 'fail' })
    }
  }

  const renderField = (tag: AddressFormField) => {
    const label = fieldText(texts, tag, 'Text')
    const placeholder = fieldText(texts, tag, 'Placeholder')
    const value = String(formData[tag] ?? '')
    const hasError = texts.errorShowType !== 'toast' && errors.includes(tag)
    return (
      <View className={b('item', { error: hasError })} key={tag}>
        <View className={b('row')}>
          <View className={b('label')}>
            {required.includes(tag) && <Text className={b('required')}>*</Text>}
            <Text>{label}</Text>
          </View>
          {tag === 'region' ? (
            <View className={b('region')} onClick={() => setShowPopup(true)}>
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
              maxLength={tag === 'tel' ? 11 : undefined}
              clearable
              onChange={(val) => updateField(tag, val)}
              onClear={() => updateField(tag, '')}
            />
          )}
        </View>
        {hasError && <View className={b('error')}>{fieldText(texts, tag, 'ErrorMsg')}</View>}
      </View>
    )
  }

  return (
    <View
      className={classNames(b({ 'with-save': showSave }), className)}
      style={style}
      id={data.id !== undefined ? String(data.id) : undefined}
    >
      {ADDRESS_FORM_FIELDS.map(renderField)}
      {bottomInputTpl}
      {showDefault && (
        <View className={b('item', { default: true })}>
          <Text className={b('default-label')}>{locale.addressedit.setDefaultText}</Text>
          <Switch
            checked={!!formData.default}
            onChange={(state) => {
              const next = { ...formData, default: state }
              setFormData(next)
              onSwitch?.(state, next)
            }}
          />
        </View>
      )}
      {showSave && (
        <View className={b('bottom')}>
          <Button block type="primary" onClick={save} {...buttonProps}>
            {texts.bottomText}
          </Button>
        </View>
      )}
      <Address
        modelValue={showPopup}
        type={address.type ?? 'custom'}
        modelSelect={regionSelect}
        province={address.province ?? []}
        city={address.city ?? []}
        country={address.country ?? []}
        town={address.town ?? []}
        height={address.height || '270px'}
        customAddressTitle={address.addressTitle ?? locale.address.selectRegion}
        existAddressTitle={address.addressTitle ?? locale.address.selectRegion}
        onChange={handleChangeAddress}
        onClose={handleCloseAddress}
      />
      <Toast id={toastId} />
    </View>
  )
}

AddressEdit.displayName = 'NbAddressEdit'
