import { useEffect, useMemo, useRef, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Image } from '@tarojs/components'
import { Button, Checkbox, Input, Toast } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import { Eye, Marshalling } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import { useUuid } from '../../utils/use-uuid'
import type { IComponent } from '../../utils/typings'
import { createCountdown, isLoginReady, isTelOrMail } from './utils'
import type { Countdown } from './utils'

export type LoginType = 'verify' | 'pwd'
export type LoginShowErrorType = 'toast' | 'bottomMsg'
export type LoginInputTag = 'account' | 'password' | 'telOrMail' | 'verify'

export interface LoginParamsProps {
  account?: string
  accountPlaceholder?: string
  accountErrorText?: string
  telOrMail?: string
  telOrMailPlaceholder?: string
  telOrMailErrorText?: string
  password?: string
  passwordPlaceholder?: string
  passwordErrorText?: string
  isShowPwdInput?: boolean
  verify?: string
  verifyPlaceholder?: string
  verifyButtonText?: string
  verifyErrorText?: string
  getCodeErrorToast?: string
  switchLoginText1?: string
  switchLoginText2?: string
  forgetPwdText?: string
  [key: string]: any
}

export interface LoginFormProps {
  account?: string
  password?: string
  telOrMail?: string
  verify?: string
  [key: string]: any
}

export interface LoginProps extends IComponent {
  logo: string
  title: string
  formParams: LoginParamsProps
  loginType: LoginType
  loginButtonDisable: boolean
  loginButtonText: string
  hasForgetPassWord: boolean
  showErrorType: LoginShowErrorType
  toastErrorText: string
  hasHidePwd: boolean
  isGetCode: boolean
  countDownTime: number
  isHideSwitchBtn: boolean
  slotProtocolText: ReactNode
  slotInput: ReactNode
  slotBottom: ReactNode
  buttonProps: Partial<ButtonProps>
  /** 点击获取验证码前校验手机号/邮箱, 返回 false 时 toast `getCodeErrorToast` */
  validateTelOrMail: (value: string) => boolean
  onInputChange: (value: string, tag: LoginInputTag) => void
  onLoginBtnClick: (formData: LoginFormProps, totalData: LoginParamsProps) => void
  onVerifyBtnClick: (formData: LoginFormProps, totalData: LoginParamsProps) => void
  onForgetBtnClick: () => void
  onInputClear: (tag: LoginInputTag) => void
  onLoginTypeClick: () => void
}

const TAGS: LoginInputTag[] = ['account', 'password', 'telOrMail', 'verify']
const EMPTY_PARAMS: LoginParamsProps = {}

const pickValues = (params: LoginParamsProps): LoginFormProps => ({
  account: params.account ?? '',
  password: params.password ?? '',
  telOrMail: params.telOrMail ?? '',
  verify: params.verify ?? '',
})

const pickErrors = (params: LoginParamsProps): Record<LoginInputTag, string> => ({
  account: params.accountErrorText ?? '',
  password: params.passwordErrorText ?? '',
  telOrMail: params.telOrMailErrorText ?? '',
  verify: params.verifyErrorText ?? '',
})

const EMPTY_ERRORS: Record<LoginInputTag, string> = {
  account: '',
  password: '',
  telOrMail: '',
  verify: '',
}

export const Login: FunctionComponent<Partial<LoginProps>> = ({
  className,
  style,
  logo = '',
  title = '',
  formParams = EMPTY_PARAMS,
  loginType = 'verify',
  loginButtonDisable = true,
  loginButtonText,
  hasForgetPassWord = true,
  hasHidePwd = true,
  isGetCode = false,
  countDownTime = 60,
  isHideSwitchBtn = false,
  showErrorType = 'toast',
  toastErrorText = '',
  slotProtocolText,
  slotInput,
  slotBottom,
  buttonProps,
  validateTelOrMail = isTelOrMail,
  onInputChange,
  onLoginBtnClick,
  onVerifyBtnClick,
  onForgetBtnClick,
  onInputClear,
  onLoginTypeClick,
}) => {
  const { locale } = useConfig()
  const b = bem('login')
  const toastId = useUuid('nb-login-toast')

  // 文案: 语言包默认值 + formParams 里显式传入的值
  const texts = useMemo(() => {
    const merged: LoginParamsProps = {
      accountPlaceholder: locale.login.accountPlaceholder,
      telOrMailPlaceholder: locale.login.telOrMailPlaceholder,
      passwordPlaceholder: locale.login.passwordPlaceholder,
      verifyPlaceholder: locale.login.verifyPlaceholder,
      verifyButtonText: locale.login.verifyButtonText,
      getCodeErrorToast: locale.login.getCodeErrorToast,
      switchLoginText1: locale.login.switchLoginText1,
      switchLoginText2: locale.login.switchLoginText2,
      forgetPwdText: locale.login.forgetPwdText,
      isShowPwdInput: true,
    }
    Object.keys(formParams).forEach((key) => {
      if (formParams[key] !== undefined) merged[key] = formParams[key]
    })
    return merged
  }, [formParams, locale])

  const [form, setForm] = useState<LoginFormProps>(() => pickValues(formParams))
  const [errors, setErrors] = useState(() => pickErrors(formParams))
  const [currLoginType, setCurrLoginType] = useState<LoginType>(loginType)
  const [isHidePwd, setIsHidePwd] = useState(true)
  const [isProtocol, setIsProtocol] = useState(false)
  const [countTime, setCountTime] = useState(countDownTime)
  const [inCountDown, setInCountDown] = useState(false)

  // formParams 里的值 / 错误文案变化时同步 (按内容比较, 避免字面量对象每次渲染都重置)
  const valuesKey = TAGS.map((t) => `${formParams[t] ?? ''}|${formParams[`${t}ErrorText`] ?? ''}`).join('\u0001')
  const firstSync = useRef(true)
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false
      return
    }
    setForm(pickValues(formParams))
    setErrors(pickErrors(formParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesKey])

  useEffect(() => {
    setCurrLoginType(loginType)
  }, [loginType])

  // 验证码倒计时
  const countdownRef = useRef<Countdown | null>(null)
  const countDownTimeRef = useRef(countDownTime)
  countDownTimeRef.current = countDownTime

  const startCountdown = () => {
    countdownRef.current?.stop()
    countdownRef.current = createCountdown({
      duration: countDownTimeRef.current,
      onTick: setCountTime,
      onEnd: () => {
        setInCountDown(false)
        setCountTime(countDownTimeRef.current)
      },
    })
    setInCountDown(true)
    countdownRef.current.start()
  }

  const stopCountdown = () => {
    countdownRef.current?.stop()
    setInCountDown(false)
    setCountTime(countDownTimeRef.current)
  }

  useEffect(() => () => countdownRef.current?.stop(), [])

  useEffect(() => {
    if (!inCountDown) setCountTime(countDownTime)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDownTime])

  // 父组件异步获取验证码成功后把 isGetCode 置为 true, 开始倒计时
  useEffect(() => {
    if (isGetCode && countDownTime > 0 && !countdownRef.current?.isRunning()) {
      startCountdown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetCode])

  // toast 错误提示
  const showToast = (content: string) => {
    if (content) Toast.show(toastId, { content, duration: 2 })
  }
  useEffect(() => {
    if (showErrorType === 'toast' && toastErrorText) showToast(toastErrorText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastErrorText])

  const totalData = (): LoginParamsProps => ({ ...texts, ...form })

  const isLoginDisable = slotInput
    ? loginButtonDisable
    : !isLoginReady({
        loginType: currLoginType,
        account: form.account,
        password: form.password,
        telOrMail: form.telOrMail,
        verify: form.verify,
        isShowPwdInput: texts.isShowPwdInput,
        needProtocol: !!slotProtocolText,
        protocolChecked: isProtocol,
      })

  const setValue = (tag: LoginInputTag, value: string) => {
    setForm((prev) => ({ ...prev, [tag]: value }))
  }

  const switchLogin = () => {
    setCurrLoginType(currLoginType === 'pwd' ? 'verify' : 'pwd')
    setForm({ account: '', password: '', telOrMail: '', verify: '' })
    setErrors(EMPTY_ERRORS)
    setIsProtocol(false)
    stopCountdown()
    onLoginTypeClick?.()
  }

  const getCode = () => {
    if (validateTelOrMail(form.telOrMail ?? '')) {
      onVerifyBtnClick?.(form, totalData())
    } else {
      showToast(texts.getCodeErrorToast ?? '')
    }
  }

  const renderInput = (tag: LoginInputTag) => {
    const error = errors[tag]
    const showError = showErrorType === 'bottomMsg' && !!error
    return (
      <View className={b('input-wrap', { error: showError })} key={tag}>
        <View className={b('input-item')}>
          <Input
            className={b('input')}
            name={tag}
            value={form[tag] ?? ''}
            placeholder={texts[`${tag}Placeholder`]}
            type={tag === 'password' && isHidePwd ? 'password' : 'text'}
            clearable
            onChange={(value) => {
              setValue(tag, value)
              onInputChange?.(value, tag)
            }}
            onClear={() => {
              setValue(tag, '')
              onInputClear?.(tag)
            }}
          />
          {tag === 'password' && hasHidePwd ? (
            <View className={b('hide-icon')} onClick={() => setIsHidePwd(!isHidePwd)}>
              {isHidePwd ? <Marshalling size={14} /> : <Eye size={14} />}
            </View>
          ) : null}
          {tag === 'verify' ? (
            inCountDown ? (
              <View className={b('code-box', { disabled: true })}>
                <View className={b('code-count')}>{countTime}s</View>
              </View>
            ) : (
              <View className={b('code-box')} onClick={getCode}>
                {texts.verifyButtonText}
              </View>
            )
          ) : null}
        </View>
        {tag === 'password' && hasForgetPassWord ? (
          <View className={b('forget-pwd')} onClick={() => onForgetBtnClick?.()}>
            {texts.forgetPwdText}
          </View>
        ) : null}
        {showError ? <View className={b('error-msg')}>{error}</View> : null}
      </View>
    )
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      {logo ? (
        <View className={b('logo')}>
          <Image className={b('logo-img')} src={logo} mode="aspectFit" />
        </View>
      ) : null}
      {title ? <View className={b('title')}>{title}</View> : null}
      <View className={b('content')}>
        {currLoginType === 'pwd'
          ? [renderInput('account'), texts.isShowPwdInput ? renderInput('password') : null]
          : [renderInput('telOrMail'), renderInput('verify')]}
        {slotInput}
        {slotProtocolText ? (
          <View className={b('protocol')}>
            <Checkbox checked={isProtocol} onChange={(state) => setIsProtocol(state)} />
            <View className={b('protocol-text')}>{slotProtocolText}</View>
          </View>
        ) : null}
      </View>
      <View className={b('btn')}>
        <Button
          block
          type="primary"
          shape="square"
          size="large"
          disabled={isLoginDisable}
          onClick={() => onLoginBtnClick?.(form, totalData())}
          {...buttonProps}
        >
          {loginButtonText || locale.login.loginButtonText}
        </Button>
      </View>
      {!isHideSwitchBtn ? (
        <View className={b('switch-type')} onClick={switchLogin}>
          {currLoginType === 'verify' ? texts.switchLoginText1 : texts.switchLoginText2}
        </View>
      ) : null}
      {slotBottom ? <View className={b('bottom')}>{slotBottom}</View> : null}
      <Toast id={toastId} />
    </View>
  )
}

Login.displayName = 'NbLogin'
