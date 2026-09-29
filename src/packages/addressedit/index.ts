import '../address'
import '@nutui/nutui-react-taro/dist/es/packages/input/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/switch/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/button/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'
import './addressedit.scss'

export { AddressEdit } from './addressedit'
export type {
  AddressEditProps,
  AddressInfo,
  AddressData,
  AddressResult,
  showErrorType,
} from './addressedit'
export type { AddressFormField } from './form'
export { AddressEdit as default } from './addressedit'
