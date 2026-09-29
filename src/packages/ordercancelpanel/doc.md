# OrderCancelPanel 订单取消面板

### 介绍

订单取消面板组件，可用来选择取消订单的原因。

### 安装

```tsx
import { OrderCancelPanel } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { OrderCancelPanel } from 'nutui-biz-taro'
import type { IreasonsObject } from 'nutui-biz-taro'

const cancelReason: IreasonsObject[] = [
  { key: 'reasons1', value: '商品无货' },
  { key: 'reasons2', value: '发货时间问题' },
  { key: 'reasons3', value: '不想要了' },
  { key: 'reasons4', value: '商品选错/多选' },
  { key: 'reasons5', value: '地址信息填写错误' },
  { key: 'reasons6', value: '商品降价' },
]

const App = () => {
  const [show, setShow] = useState(false)
  const submit = (reason: IreasonsObject, textAreaValue: string, switchStatus: boolean) => {
    console.log(reason, textAreaValue, switchStatus)
    setShow(false)
  }
  return (
    <>
      <Cell title="显示弹窗" clickable onClick={() => setShow(true)} />
      <OrderCancelPanel
        showCancelPanel={show}
        popupTitle="退款原因"
        cancelReason={cancelReason}
        buttonProps={{ type: 'primary' }}
        onClose={() => setShow(false)}
        onSubmitBtn={submit}
      />
    </>
  )
}
export default App
```

### 带有温馨提示的组件

```tsx
<OrderCancelPanel
  showCancelPanel={show}
  popupTitle="退款原因"
  reasonTitle={<View>请选择取消订单原因</View>}
  cancelReason={cancelReason}
  warmTips={[
    '1. 限时特价、预约资格等购买优惠可能一并取消',
    '2. 如遇订单拆分，京券将换成同价值京豆返还',
    '3. 支付券不予返还；支付优惠一并取消',
    '4. 订单一旦取消，无法恢复',
  ]}
  tipsTitle="温馨提示"
  submitText="确认"
  onClose={() => setShow(false)}
  onSubmitBtn={submit}
/>
```

### 带有其它原因选项的组件

`key` 为 `other` 的原因被选中时展示输入框, 输入内容作为 `onSubmitBtn` 的第二个参数。

```tsx
import type { TextAreaProps } from '@nutui/nutui-react-taro'

const textAreaProps: Partial<TextAreaProps> = {
  placeholder: '请输入内容',
  maxLength: 100,
  showCount: true,
}

<OrderCancelPanel
  showCancelPanel={show}
  popupTitle="退款原因"
  submitText="确认"
  cancelReason={[...cancelReason, { key: 'other', value: '其它' }]}
  textAreaProps={textAreaProps}
  onClose={() => setShow(false)}
  onSubmitBtn={submit}
/>
```

### 可取消已选中的原因

```tsx
<OrderCancelPanel
  showCancelPanel={show}
  popupTitle="退款原因"
  canCancelReason
  cancelReason={cancelReason}
  onClose={() => setShow(false)}
  onSubmitBtn={submit}
/>
```

### checkbox 选择框在前面, 按钮区域显示提示

```tsx
<OrderCancelPanel
  showCancelPanel={show}
  checkboxType="front"
  showBtntips
  popupTitle="退款原因"
  cancelReason={cancelReason}
  onClose={() => setShow(false)}
  onSubmitBtn={submit}
/>
```

## API

### Props

| 字段                 | 说明                                | 类型                  | 默认值     |
| -------------------- | ----------------------------------- | --------------------- | ---------- |
| showCancelPanel      | 是否显示取消订单弹窗                | boolean               | `false`    |
| warmTips             | 温馨提示内容, 无则不展示提示内容    | string[]              | -          |
| cancelReason         | 取消原因                            | IreasonsObject[]      | -          |
| canCancelReason      | 再次点击是否可以取消已选中的原因    | boolean               | `false`    |
| popupTitle           | 弹窗的主标题                        | ReactNode             | -          |
| reasonTitle          | 取消原因的标题                      | ReactNode             | -          |
| submitText           | 弹窗按钮文案                        | ReactNode             | `提交` (locale `orderCancelPanel.submitText`) |
| tipsTitle            | 温馨提示的标题                      | ReactNode             | `温馨提示` (locale `orderCancelPanel.tipsTitle`) |
| buttonProps          | 提交按钮的 props (NutUI 3.x `ButtonProps`), 默认 `type="primary"` `block` | Partial&lt;ButtonProps&gt; | -          |
| textAreaProps        | 其它原因输入框的 props (NutUI 3.x `TextAreaProps`, 不含 `value/defaultValue/onChange`) | Partial&lt;TextAreaProps&gt; | -          |
| popupProps           | 弹窗的 props (NutUI 3.x `PopupProps`), `visible/position/round/closeable` 由组件控制 | Partial&lt;PopupProps&gt; | -          |
| checkboxType         | checkbox 选择框和原因文案的前后位置 | `back` \| `front`     | `back`     |
| safeAreaCancelBottom | 按钮区域是否适配底部安全区          | boolean               | `false`    |
| showBtntips          | 是否在按钮区域显示提示与开关        | boolean               | `false`    |
| btnTipsText          | 按钮区域的提示文案                  | ReactNode             | `提交后，将本单商品放回购物车中` (locale `orderCancelPanel.btnTipsText`) |
| className            | 弹窗类名                            | string                | -          |
| style                | 弹窗样式                            | CSSProperties         | -          |

### IreasonsObject

| 字段  | 说明                            | 类型   | 默认值 |
| ----- | ------------------------------- | ------ | ------ |
| key   | 取消原因的 key, 每项不同; `other` 表示 "其它原因" | string | -      |
| value | 取消原因的文案内容              | string | -      |

### Events

| 字段        | 说明             | 回调参数                                                            |
| ----------- | ---------------- | ------------------------------------------------------------------- |
| onClose     | 关闭弹框时触发 (同时清空已选原因、输入内容和开关) | -                                                                   |
| onSubmitBtn | 点击提交按钮触发 | `selectedReason: IreasonsObject` (未选择时为 `undefined`), `textAreaValue: string` (仅选中 `other` 时有值), `switchStatus: boolean` |

## 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-ordercancel-padding | `$nb-spacing-xl` |
| --nb-ordercancel-title-color | `$nb-color-title` |
| --nb-ordercancel-title-font-size | `$nb-font-size-xl` |
| --nb-ordercancel-tips-color | `$nb-color-text` |
| --nb-ordercancel-tips-background | `$nb-color-surface-variant` |
| --nb-ordercancel-tips-radius | `$nb-radius-base` |
| --nb-ordercancel-reason-color | `$nb-color-title` |
| --nb-ordercancel-area-border | `$nb-color-border` |
| --nb-ordercancel-btns-background | `$nb-color-surface` |

## 迁移说明 (相对 @nutui/nutui-biz 1.x)

- `buttonProps` / `textAreaProps` / `popupProps` 的类型改为 `@nutui/nutui-react-taro` 3.x:
  TextArea `maxlength→maxLength`、`limitshow→showCount`; Popup `onClickOverlay→onOverlayClick`、`closeOnClickOverlay→closeOnOverlayClick` 等。
- 提交按钮默认 `type="primary"` `block` (旧版无默认样式)。
- 按钮区域开关改为受控, 关闭弹窗后会复位。
- 不再透传任意 HTML 属性。
