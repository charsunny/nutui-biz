# Login 登录

### 介绍

主要应用在登录页面, 支持 手机/邮箱 + 验证码 与 账号 + 密码 两种登录方式。依赖 NutUI 组件: Input、Checkbox、Button、Toast。

### 安装

```tsx
import { Login } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

点击 "获取验证码" 时先用 `validateTelOrMail` 校验手机号/邮箱, 通过后触发 `onVerifyBtnClick`;
业务方异步获取验证码成功后把 `isGetCode` 置为 `true`, 组件开始 `countDownTime` 秒倒计时。

```tsx
import { useState } from 'react'
import { Login } from 'nutui-biz-taro'

const App = () => {
  const [isGetCode, setIsGetCode] = useState(false)
  return (
    <Login
      loginType="verify"
      logo="https://img10.360buyimg.com/imagetools/jfs/t1/187998/28/32123/16333/63e346b8F0bff354b/c95da99ea108c463.png"
      isGetCode={isGetCode}
      countDownTime={30}
      onInputChange={(value, tag) => console.log(tag, value)}
      onVerifyBtnClick={(formData) => {
        setIsGetCode(false)
        // 异步获取验证码成功
        setTimeout(() => setIsGetCode(true), 300)
      }}
      onLoginBtnClick={(formData) => console.log('login', formData)}
    />
  )
}
```

### 有用户隐私勾选项

传入 `slotProtocolText` 后展示勾选框, 勾选后登录按钮才可点击。`toastErrorText` 有值时以 Toast 提示。

```tsx
<Login
  toastErrorText={toastText}
  onLoginBtnClick={() => setToastText('toast 错误提示')}
  slotProtocolText={
    <View>
      勾选后代表您已阅读并同意<Text style={{ color: '#ff0f23' }}>《用户隐私政策》</Text>
    </View>
  }
/>
```

### 错误提示

`showErrorType="bottomMsg"` 时在输入框下方展示 `formParams` 中的 `xxxErrorText`。

```tsx
<Login
  loginType="pwd"
  showErrorType="bottomMsg"
  formParams={{ account: '12345', accountErrorText: '账号不存在', password: '123', passwordErrorText: '请输入6位密码' }}
/>
```

### 用户仅账号登录

```tsx
<Login title="卡号登录" loginType="pwd" isHideSwitchBtn formParams={{ isShowPwdInput: false }} />
```

### 用户自定义输入框

使用 `slotInput` 时登录按钮是否可点由 `loginButtonDisable` 控制。自定义输入框可复用
`nb-login__input-wrap` / `nb-login__input-item` / `nb-login__input` / `nb-login__code-box` 类名保持样式一致。

```tsx
import { View, Image } from '@tarojs/components'
import { Input } from '@nutui/nutui-react-taro'

<Login
  title="卡号登录"
  loginType="pwd"
  isHideSwitchBtn
  formParams={{ isShowPwdInput: false }}
  loginButtonDisable={!(account && customInput)}
  onInputChange={(value, tag) => tag === 'account' && setAccount(value)}
  slotInput={
    <View className="nb-login__input-wrap">
      <View className="nb-login__input-item">
        <Input className="nb-login__input" value={customInput} placeholder="请输入验证码" onChange={setCustomInput} />
        <View className="nb-login__code-box">
          <Image style={{ width: '65px', height: '30px' }} src="https://img12.360buyimg.com/imagetools/jfs/t1/211415/19/9275/14512/61924b82E09366437/cc5cc7297b9073ae.jpg" />
        </View>
      </View>
    </View>
  }
  slotBottom={<View style={{ textAlign: 'center' }}>新用户注册</View>}
/>
```

## API

### Props

| 字段               | 说明                                                        | 类型                   | 默认值     |
| ------------------ | ----------------------------------------------------------- | ---------------------- | ---------- |
| logo               | 头部图标链接，不配置不显示                                  | string                 | -          |
| title              | 头部标题，不配置不显示                                      | string                 | -          |
| formParams         | 输入框初始值与文案配置                                      | LoginParamsProps       | `{}`       |
| loginType          | 登录类型，验证码 `verify`，账号密码 `pwd`                   | string                 | `verify`   |
| loginButtonDisable | 登录按钮是否禁用，仅在使用 `slotInput` 时生效 (内置输入框时由输入内容自动计算) | boolean | `true`     |
| loginButtonText    | 登录按钮文案                                                | string                 | `登录` (随语言包) |
| hasForgetPassWord  | 是否有忘记密码按钮                                          | boolean                | `true`     |
| hasHidePwd         | 是否有隐藏/显示密码按钮                                     | boolean                | `true`     |
| isGetCode          | 是否成功获取验证码，变为 `true` 时开始倒计时                | boolean                | `false`    |
| isHideSwitchBtn    | 是否隐藏登录类型切换按钮                                    | boolean                | `false`    |
| countDownTime      | 验证码倒计时秒数                                            | number                 | `60`       |
| showErrorType      | 错误提示方式，可选 `toast` `bottomMsg`                      | string                 | `toast`    |
| toastErrorText     | toast 错误提示内容，`showErrorType="toast"` 时值变化即提示   | string                 | -          |
| validateTelOrMail  | 获取验证码前的手机号/邮箱校验，返回 `false` 时提示 `getCodeErrorToast` | (value: string) => boolean | 内置 `isTelOrMail` (大陆手机号或邮箱) |
| slotProtocolText   | 自定义勾选知情同意内容                                      | ReactNode              | -          |
| slotBottom         | 自定义登录按钮下方内容                                      | ReactNode              | -          |
| slotInput          | 自定义输入框                                                | ReactNode              | -          |
| buttonProps        | 登录按钮 props，NutUI React Taro 3.x 的 Button              | Partial\<ButtonProps\> | -          |
| className          | 根节点类名                                                  | string                 | -          |
| style              | 根节点样式                                                  | CSSProperties          | -          |

### LoginParamsProps

| 字段                 | 说明                                     | 类型    | 默认值 (随语言包)          |
| -------------------- | ---------------------------------------- | ------- | -------------------------- |
| account              | 账号                                     | string  | -                          |
| accountPlaceholder   | 账号输入框占位文字                       | string  | `请输入登录码`             |
| accountErrorText     | 账号错误提示文字                         | string  | -                          |
| telOrMail            | 手机或邮箱                               | string  | -                          |
| telOrMailPlaceholder | 手机或邮箱占位文字                       | string  | `请输入手机号或邮箱`       |
| telOrMailErrorText   | 手机或邮箱错误提示文字                   | string  | -                          |
| password             | 密码                                     | string  | -                          |
| passwordPlaceholder  | 密码占位文字                             | string  | `请输入密码`               |
| passwordErrorText    | 密码错误提示文字                         | string  | -                          |
| isShowPwdInput       | 是否展示密码输入框                       | boolean | `true`                     |
| verify               | 验证码                                   | string  | -                          |
| verifyPlaceholder    | 验证码占位文字                           | string  | `请输入验证码`             |
| verifyButtonText     | 获取验证码按钮文字                       | string  | `获取验证码`               |
| verifyErrorText      | 验证码错误提示文字                       | string  | -                          |
| getCodeErrorToast    | 手机号/邮箱校验不通过时的提示            | string  | `请填写正确的手机号或邮箱` |
| switchLoginText1     | 当前为验证码登录时的切换按钮文字         | string  | `账号密码登录`             |
| switchLoginText2     | 当前为账号密码登录时的切换按钮文字       | string  | `手机/邮箱登录`            |
| forgetPwdText        | 忘记密码按钮文案                         | string  | `忘记密码`                 |

`formParams` 中输入值 / 错误文案变化时会同步到输入框; 切换登录方式会清空输入、错误、勾选状态并停止倒计时。

### Events

| 字段             | 说明                                                     | 回调参数                                         |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------ |
| onInputChange    | 输入框输入                                               | `value`, `tag` (`account` `password` `telOrMail` `verify`) |
| onLoginBtnClick  | 登录按钮点击                                             | `formData: LoginFormProps`, `totalData: LoginParamsProps` |
| onVerifyBtnClick | 获取验证码按钮点击 (校验通过后)                          | `formData: LoginFormProps`, `totalData: LoginParamsProps` |
| onForgetBtnClick | 点击忘记密码                                             | -                                                |
| onInputClear     | 点击输入框清除按钮                                       | `tag`                                            |
| onLoginTypeClick | 点击切换登录方式                                         | -                                                |

### 工具函数

同时导出组件内部使用的纯函数, 方便业务复用:

| 名称                 | 说明                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| isTelOrMail          | 大陆 11 位手机号或邮箱                                               |
| isLoginReady         | 内置输入框模式下登录按钮是否可点                                     |
| createLoginCountdown | 秒级倒计时 `createLoginCountdown({ duration, onTick, onEnd })`，返回 `{ start, stop, isRunning, getRemaining }` |

## 主题定制

| 名称                          | 默认值                  |
| ----------------------------- | ----------------------- |
| --nb-login-background         | `$nb-color-surface`     |
| --nb-login-input-border-color | `$nb-color-border`      |
| --nb-login-input-radius       | `$nb-radius-xs`         |
| --nb-login-link-color         | `$nb-color-info`        |
| --nb-login-error-color        | `$nb-color-primary`     |
| --nb-login-code-color         | `$nb-color-text`        |
