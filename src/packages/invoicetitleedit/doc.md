# InvoiceTitleEdit 发票抬头编辑

### 介绍

编辑增值税专用发票 / 电子普通发票的抬头信息, 内置必填校验。依赖 NutUI 组件: Form、Input、Radio、Button。

### 安装

```tsx
import { InvoiceTitleEdit } from 'nutui-biz-taro'
```

## 代码演示

### 增值税专用发票

增值税专用发票: 发票抬头、注册地址、注册电话、开户行、银行账户必填, 纳税人识别号不可修改。

```tsx
import { InvoiceTitleEdit } from 'nutui-biz-taro'

const App = () => (
  <InvoiceTitleEdit
    data={{
      title: '京东集团',
      companyCode: '123456ABCD',
      address: '北京市经开区',
      companyPhone: '010-12345678',
      bankDeposit: '中国银行',
      bankAccount: '12345678',
    }}
    submitFixed={false}
    onSubmit={(arg) => {
      if (Array.isArray(arg)) console.log('校验失败', arg)
      else console.log('提交', arg)
    }}
    onInput={(val) => console.log(val)}
  />
)
```

### 电子普通发票

电子普通发票可选择抬头类型, 选择 "企业" 时纳税人识别号必填。

```tsx
<InvoiceTitleEdit data={{ ...data, titleType: 'enterprise' }} invoiceType="normal" submitButtonText="提交" submitFixed={false} />
```

### 自定义底部

默认提交按钮固定在页面底部 (`submitFixed`), 组件会在自身末尾留出同等高度的占位。

```tsx
<InvoiceTitleEdit invoiceType="normal" bottom={<View style={{ textAlign: 'center' }}>自定义底部</View>} />
```

## API

### Props

| 字段             | 说明                                         | 类型                                   | 默认值                |
| ---------------- | -------------------------------------------- | -------------------------------------- | --------------------- |
| data             | 初始数据，变化时会回填表单                   | Partial\<Idata\>                       | -                     |
| invoiceType      | 发票类型，可选 `normal` `special`            | string                                 | `special`             |
| fields           | 展示的字段 (按此顺序)；未展示的字段不渲染、不参与校验 | InvoiceTitleField[]              | 全部 (`INVOICE_TITLE_FIELDS`) |
| bottom           | 表单与提交按钮之间的自定义内容               | ReactNode                              | -                     |
| submitButtonText | 提交按钮文案                                 | string                                 | `提交审批` (随语言包) |
| submitFixed      | 提交按钮是否固定在页面底部                   | boolean                                | `true`                |
| buttonProps      | 提交按钮 props (NutUI React Taro 3.x Button) | Partial\<Omit\<ButtonProps, 'type' \| 'block'\>\> | -       |
| className        | 根节点类名                                   | string                                 | -                     |
| style            | 根节点样式                                   | CSSProperties                          | -                     |

### Events

| 字段     | 说明                                                                                 | 回调参数            |
| -------- | ------------------------------------------------------------------------------------ | ------------------- |
| onSubmit | 点击提交按钮。校验通过时参数为表单值对象; 校验失败时参数为错误数组 (`Array.isArray` 可区分) | `arg: any`          |
| onInput  | 发票抬头输入                                                                         | `value: string`     |
| onTitleTypeChange | 切换抬头类型 (仅电子普通发票), 可据此切换 `fields`                          | `titleType: string` |

### Idata (导出名 `InvoiceTitleEditData`)

| 字段         | 说明                                                             | 类型   |
| ------------ | ---------------------------------------------------------------- | ------ |
| titleType    | 抬头类型，仅电子普通发票，可选 `personal` `enterprise`，默认 `personal` | string |
| title        | 发票抬头                                                         | string |
| companyCode  | 纳税人识别号                                                     | string |
| address      | 注册地址                                                         | string |
| companyPhone | 注册电话                                                         | string |
| bankDeposit  | 开户行                                                           | string |
| bankAccount  | 银行账户                                                         | string |

### 工具函数

| 名称                         | 说明                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| validateInvoiceTitle         | `(values, invoiceType) => InvoiceTitleField[]`，返回未填写的必填字段 (仅空白视为未填) |
| isInvoiceTitleFieldRequired  | `(field, invoiceType, titleType?) => boolean`                        |
| isInvoiceTitleFieldReadOnly  | `(field, invoiceType) => boolean`                                    |
| getInvoiceTitleFieldRules    | 生成 Form.Item 的 `rules`                                            |
| INVOICE_TITLE_FIELDS         | 字段列表                                                             |

## 主题定制

| 名称                                       | 默认值              |
| ------------------------------------------ | ------------------- |
| --nb-invoice-title-edit-submit-padding     | `10px 10px 20px`    |
| --nb-invoice-title-edit-submit-background  | `$nb-color-surface` |
