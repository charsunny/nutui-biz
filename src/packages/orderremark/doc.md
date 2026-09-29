# OrderRemark 订单备注

### 介绍

常见于订单提交页与订单售后页面，用以添加备注信息。

### 安装

```tsx
import { OrderRemark } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { OrderRemark } from 'nutui-biz-taro'

const App = () => {
  const [show, setShow] = useState(false)
  const [mark, setMark] = useState('')
  return (
    <>
      <Cell title="订单备注" extra={mark || '请输入备注信息'} clickable onClick={() => setShow(true)} />
      <OrderRemark
        visible={show}
        remark={mark}
        onClose={() => setShow(false)}
        onSubmit={(val) => setMark(val)}
      />
    </>
  )
}
export default App
```

### 带有标签

点击标签会以 `，` 拼接到备注末尾, 超出 `maxLength` 时截断。

```tsx
<OrderRemark
  visible={show}
  maxLength={100}
  remark={mark}
  recommendTags={['京东快递', '轻拿轻放', '周末配送', '配送前，需提前电话联系', '如家中无人，可电话后，放置于门口']}
  onClose={() => setShow(false)}
  onSubmit={(val) => setMark(val)}
/>
```

### 自定义文案

```tsx
<OrderRemark
  visible={show}
  remark={mark}
  recommendTags={tags}
  submitText="提交"
  placeholderText="请填写备注信息"
  title="备注信息"
  tagTitle="快捷选择"
  onClose={() => setShow(false)}
  onSubmit={(val) => setMark(val)}
/>
```

### 事件演示

```tsx
import { Toast } from '@nutui/nutui-react-taro'

<OrderRemark
  visible={show}
  remark={mark}
  recommendTags={tags}
  onOpen={() => Toast.show('toast', { content: 'onOpen' })}
  onClose={(val) => {
    console.log('onClose', val)
    setShow(false)
  }}
  onClickOverlay={(val) => console.log('onClickOverlay', val)}
  onClickTag={(tag, index, str) => console.log('onClickTag', tag, index, str)}
  onChange={(val) => console.log('onChange', val)}
  onSubmit={(val) => {
    Toast.show('toast', { content: `onSubmit: ${val}` })
    setMark(val)
  }}
/>
<Toast id="toast" />
```

## API

### Props

| 字段                | 说明                 | 类型     | 默认值           |
| ------------------- | -------------------- | -------- | ---------------- |
| visible             | 是否显示弹窗         | boolean  | `false`          |
| closeOnClickOverlay | 点击遮罩是否可以关闭 | boolean  | `true`           |
| maxLength           | 备注内容长度限制     | number   | `50`             |
| placeholderText     | 输入框为空时占位符   | string   | `请输入备注内容` (locale `orderRemark.placeholderText`) |
| title               | 弹窗的主标题         | ReactNode | `订单备注` (locale `orderRemark.title`) |
| tagTitle            | 标签内容标题         | ReactNode | `推荐标签` (locale `orderRemark.tagTitle`) |
| remark              | 备注信息             | string   | -                |
| submitText          | 提交按钮文案         | ReactNode | `确认` (locale `orderRemark.submitText`) |
| recommendTags       | 标签渲染数据         | string[] | `[]`             |
| className           | 内容区类名           | string   | -                |
| style               | 内容区样式           | CSSProperties | -           |

### Events

| 字段           | 说明               | 回调参数     |
| -------------- | ------------------ | ------------ |
| onClickOverlay | 点击弹窗遮罩时触发 | 当前备注信息 |
| onClose        | 弹出层关闭时触发 (遮罩 / 关闭图标 / 提交) | 当前备注信息 |
| onOpen         | 弹出层打开时触发   | -            |
| onChange       | 输入内容改变时触发 | 当前备注信息 |
| onClickTag     | 点击标签时触发     | `tag: string, index: number, remark: string` (拼接后、截断前的备注) |
| onSubmit       | 点击提交按钮触发   | 当前备注信息 |

## 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-order-remark-title-color | `$nb-color-title` |
| --nb-order-remark-title-font-size | `$nb-font-size-l` |
| --nb-order-remark-textarea-border | `$nb-color-border` |
| --nb-order-remark-textarea-radius | `$nb-radius-base` |
| --nb-order-remark-count-color | `$nb-color-text-help` |
| --nb-order-remark-tag-title-color | `$nb-color-text-help` |
| --nb-order-remark-tag-color | `$nb-color-title` |
| --nb-order-remark-tag-background | `$nb-color-background` |
| --nb-order-remark-btn-background | `$nb-color-surface` |

## 迁移说明 (相对 @nutui/nutui-biz 1.x)

- 公共 props 与事件保持不变。
- 输入框改为 `@tarojs/components` 的 `Textarea` (受控), 点击标签后输入框内容会同步更新。
- 不再透传任意 HTML 属性。
