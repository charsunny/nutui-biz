import type { ITouchEvent } from '@tarojs/components'
import type { numericProp } from '../../utils/props'

export interface IDataInfo {
  id: numericProp
  addressName: string
  phone: string
  defaultAddress: boolean
  fullAddress: string
}

/** AddressList 各点击事件的回调 */
export type AddressListHandler = (event: ITouchEvent, item: IDataInfo) => void
/** @deprecated 使用 AddressListHandler */
export type functionType = AddressListHandler
