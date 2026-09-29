import type { ReactNode } from 'react'
import type { IComponent } from '../../utils/typings'

export interface RegionData {
  id?: string | number
  name?: string
  /** type="elevator" 时必填, 楼层索引 (一般为拼音首字母) */
  title?: string
  [key: string]: any
}

/** 行政区域层级 */
export type RegionKey = 'province' | 'city' | 'country' | 'town'

export interface ChangeCallBack {
  /** 下一级, 已是最后一级时为 '' */
  next: RegionKey | ''
  value: RegionData
  /** 当前点击的层级 */
  custom: RegionKey
}

export interface NextListObj extends ChangeCallBack {
  selectedRegion?: SelectedRegionObj
}

/** 已选地址 */
export interface SelectedRegionObj {
  province: RegionData
  city: RegionData
  country: RegionData
  town: RegionData
}

export interface CloseCallBackData extends SelectedRegionObj {
  addressIdStr: string
  addressStr: string
}

export interface AddressList {
  id?: string | number
  provinceName: string
  cityName: string
  countyName: string
  townName: string
  addressDetail: string
  selectedAddress: boolean
  name?: string
  phone?: string
}

export interface CloseCallBack {
  data: CloseCallBackData | AddressList
  type: AddressType
}

export interface BaseAddressInfo {
  province: RegionData[]
  city: RegionData[]
  country: RegionData[]
  town: RegionData[]
}
/** @deprecated 使用 BaseAddressInfo */
export type baseAddressInfo = BaseAddressInfo

export interface AddressResult extends AddressList, BaseAddressInfo {
  addressIdStr: string
  addressStr: string
}

export type AddressType = 'exist' | 'custom' | 'elevator'

export type ClickItemResolve = (value: boolean | PromiseLike<boolean>) => void

export interface AddressProps extends IComponent, BaseAddressInfo {
  /** 是否打开地址选择 */
  modelValue: boolean
  /** 默认选中地址, 按 province、city、country、town 顺序的 id 数组 */
  modelSelect: (string | number)[]
  type: AddressType
  isShowCustomAddress: boolean
  existAddress: AddressList[]
  loading: boolean
  customAddressTitle: ReactNode
  existAddressTitle: ReactNode
  customAndExistTitle: ReactNode
  /** type="elevator" 时列表区域高度 */
  height: string | number
  defaultIcon: ReactNode
  selectedIcon: ReactNode
  /** 关闭按钮图标, 传 null 不显示 */
  closeBtnIcon: ReactNode
  /** 已有地址切到自定义地址时, 左上角返回按钮图标, 传 null 不显示 */
  backBtnIcon: ReactNode
  bottom: ReactNode
  onSelected?: (prevExistAdd: AddressList, item: AddressList, copyExistAdd: AddressList[]) => void
  onClose?: (cal: CloseCallBack) => void
  onCloseMask?: (cal: { closeWay: 'mask' | 'cross' }) => void
  onSwitchModule?: (cal: { type: AddressType }) => void
  onChange?: (cal: ChangeCallBack) => void
  /**
   * 点击地区时触发, 用于异步加载下一级。调用 resolve(true) 切到下一级,
   * resolve(false) 关闭弹窗并触发 onClose。
   */
  onClickItem?: (cal: ChangeCallBack, resolve: ClickItemResolve) => void | Promise<void>
  onTabChecked?: (cal: RegionKey) => void
}

export interface ElevatorGroup {
  title: string
  list: RegionData[]
}
