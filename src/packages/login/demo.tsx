import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Input } from '@nutui/nutui-react-taro'
import { Login } from './index'
import type { LoginFormProps, LoginParamsProps } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const logoImg =
  'https://img10.360buyimg.com/imagetools/jfs/t1/187998/28/32123/16333/63e346b8F0bff354b/c95da99ea108c463.png'

const formParams: LoginParamsProps = { verifyButtonText: '获取验证码' }
const formParams2: LoginParamsProps = { isShowPwdInput: false }
const formParams3: LoginParamsProps = {
  account: '12345',
  accountErrorText: '账号不存在',
  password: '123',
  passwordErrorText: '请输入6位密码',
}

const onChange = (value: string, tag: string) => console.log(tag, value)

/** 模拟异步请求验证码: 成功后把 isGetCode 置为 true, 组件开始倒计时 */
const useVerifyCode = () => {
  const [isGetCode, setIsGetCode] = useState(false)
  const query = (formData: LoginFormProps) => {
    console.log('getcode', formData)
    setIsGetCode(false)
    setTimeout(() => setIsGetCode(true), 300)
  }
  return [isGetCode, query] as const
}

const LoginDemo = () => {
  const [getVerify, queryVerifyCode] = useVerifyCode()
  const [getVerify2, queryVerifyCode2] = useVerifyCode()
  const [toastText, setToastText] = useState('')
  const [account, setAccount] = useState('')
  const [customInput, setCustomInput] = useState('')

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Login
          className="demo-login-basic"
          formParams={formParams}
          loginType="verify"
          logo={logoImg}
          isGetCode={getVerify}
          countDownTime={30}
          onInputChange={onChange}
          onVerifyBtnClick={queryVerifyCode}
          onLoginBtnClick={(formData) => console.log('login', formData)}
          onForgetBtnClick={() => console.log('点击忘记密码')}
        />
      </DemoBlock>

      <DemoBlock title="有用户隐私勾选项">
        <Login
          formParams={formParams}
          loginType="verify"
          logo={logoImg}
          isGetCode={getVerify2}
          onVerifyBtnClick={queryVerifyCode2}
          onInputChange={onChange}
          toastErrorText={toastText}
          onLoginBtnClick={() => {
            setToastText('toast 错误提示')
            setTimeout(() => setToastText(''), 2000)
          }}
          slotProtocolText={
            <View>
              勾选后代表您已阅读并同意
              <Text style={{ color: '#ff0f23' }} onClick={() => console.log('protocolClick')}>
                《用户隐私政策》
              </Text>
            </View>
          }
        />
      </DemoBlock>

      <DemoBlock title="错误提示">
        <Login
          formParams={formParams3}
          logo={logoImg}
          loginType="pwd"
          showErrorType="bottomMsg"
          onInputChange={onChange}
        />
      </DemoBlock>

      <DemoBlock title="用户仅账号登录">
        <Login
          formParams={formParams2}
          title="卡号登录"
          loginType="pwd"
          isHideSwitchBtn
          onInputChange={onChange}
        />
      </DemoBlock>

      <DemoBlock title="用户自定义输入框">
        <Login
          formParams={formParams2}
          title="卡号登录"
          loginType="pwd"
          isHideSwitchBtn
          loginButtonDisable={!(account && customInput)}
          onInputChange={(value, tag) => tag === 'account' && setAccount(value)}
          onInputClear={(tag) => tag === 'account' && setAccount('')}
          slotInput={
            <View className="nb-login__input-wrap">
              <View className="nb-login__input-item">
                <Input
                  className="nb-login__input"
                  value={customInput}
                  placeholder="请输入验证码"
                  clearable
                  onChange={setCustomInput}
                  onClear={() => setCustomInput('')}
                />
                <View className="nb-login__code-box">
                  <Image
                    style={{ width: '65px', height: '30px' }}
                    src="https://img12.360buyimg.com/imagetools/jfs/t1/211415/19/9275/14512/61924b82E09366437/cc5cc7297b9073ae.jpg"
                  />
                </View>
              </View>
            </View>
          }
          slotBottom={
            <View style={{ color: '#0073ff', textAlign: 'center', fontSize: '14px' }}>新用户注册</View>
          }
        />
      </DemoBlock>
    </DemoPage>
  )
}

export default LoginDemo
