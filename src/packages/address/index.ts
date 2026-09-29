import '@nutui/nutui-react-taro/dist/es/packages/popup/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/elevator/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/button/style/css'
import './address.scss'

export { Address } from './address'
export type {
  AddressProps,
  AddressType,
  AddressList as AddressExistItem,
  AddressResult as AddressCloseResult,
  BaseAddressInfo,
  ChangeCallBack,
  ClickItemResolve,
  CloseCallBack,
  CloseCallBackData,
  NextListObj,
  RegionData,
  RegionKey,
  SelectedRegionObj,
} from './type'
export { Address as default } from './address'
