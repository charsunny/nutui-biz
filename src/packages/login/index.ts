import '@nutui/nutui-react-taro/dist/es/packages/input/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/button/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/checkbox/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'
import './login.scss'

export { Login } from './login'
export type {
  LoginProps,
  LoginParamsProps,
  LoginFormProps,
  LoginInputTag,
  LoginType,
  LoginShowErrorType,
} from './login'
export { isTelOrMail, isLoginReady, createCountdown as createLoginCountdown } from './utils'
export type {
  LoginReadyState,
  Countdown as LoginCountdown,
  CountdownOptions as LoginCountdownOptions,
} from './utils'
export { Login as default } from './login'
