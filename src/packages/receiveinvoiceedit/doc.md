# ReceiveInvoiceEdit 收票地址编辑

### 介绍

发票收票人地址编辑，常见于收票人地址管理页面，用于新增或修改收票地址。所在地区使用内置的 Address 地址选择弹层。

### 安装

```tsx
import { ReceiveInvoiceEdit } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { ReceiveInvoiceEdit } from 'nutui-biz-taro'
import type { InvoiceAddressResult, InvoiceInfo } from 'nutui-biz-taro'

const address: InvoiceAddressResult = {
  addressSelect: [],
  addressTitle: '选择所在地区',
  province: [
    { id: 1, name: '北京', title: 'B' },
    { id: 2, name: '广西', title: 'G' },
  ],
  city: [
    { id: 7, name: '朝阳区', title: 'C' },
    { id: 8, name: '崇文区', title: 'C' },
  ],
  country: [
    { id: 3, name: '八里庄街道', title: 'B' },
    { id: 9, name: '北苑', title: 'B' },
  ],
  town: [],
}

const invoiceInfo: InvoiceInfo = {
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
}

const App = () => (
  <ReceiveInvoiceEdit
    address={address}
    data={{ required: ['name', 'tel'] }}
    invoiceInfo={invoiceInfo}
    onSave={(formData) => console.log(formData)}
  />
)
export default App
```

### 修改地址

```tsx
const invoiceInfo: InvoiceInfo = {
  name: 'xx',
  tel: '12345678913',
  region: '北京朝阳区八里庄街道',
  regionIds: [1, 7, 3],
  address: 'xxx小区3-2-302',
}

<ReceiveInvoiceEdit
  address={{ ...address, addressSelect: [1, 7, 3] }}
  data={{ required: ['name', 'tel'] }}
  invoiceInfo={invoiceInfo}
  onSave={(formData) => console.log(formData)}
  onAddressChange={(cal) => console.log(cal)}
  onAddressClose={(val) => console.log(val)}
/>
```

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| address | 地址选择弹层相关数据 | InvoiceAddressResult | `{}` |
| data | 文案、必填项等设置 | InvoiceData | `{}` |
| invoiceInfo | 表单初始值 | InvoiceInfo | `{}` |
| buttonProps | 保存按钮的 props | [ButtonProps](https://nutui.jd.com/taro/react/3x/#/zh-CN/component/button) | - |

### InvoiceAddressResult

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| addressSelect | 默认选中地区 id (invoiceInfo.regionIds 非空时以其为准) | (string \| number)[] | `[]` |
| province | 省, 每项必须有 `id`、`name` | RegionData[] | `[]` |
| city | 市 | RegionData[] | `[]` |
| country | 县 | RegionData[] | `[]` |
| town | 乡/镇 | RegionData[] | `[]` |
| addressTitle | 地址选择弹层标题 | string | `请选择所在地区` |

### InvoiceData

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| nameText | 姓名文案 | string | `姓名` |
| namePlaceholder | 姓名占位文案 | string | `请输入姓名` |
| nameErrorMsg | 姓名必填错误提示 | string | `该项为必填项，请填写完后提交` |
| telText | 手机号码文案 | string | `手机号码` |
| telPlaceholder | 手机号码占位文案 | string | `请输入手机号码` |
| telErrorMsg | 手机号码必填错误提示 | string | `该项为必填项，请填写完后提交` |
| regionText | 所在地区文案 | string | `所在地区` |
| regionPlaceholder | 所在地区占位文案 | string | `请选择所在地区` |
| regionErrorMsg | 所在地区必填错误提示 | string | `该项为必填项，请填写完后提交` |
| addressText | 详细地址文案 | string | `详细地址` |
| addressPlaceholder | 详细地址占位文案 | string | `街道、楼牌号` |
| addressErrorMsg | 详细地址必填错误提示 | string | `该项为必填项，请填写完后提交` |
| required | 必填项, 可选 `name` / `tel` / `region` / `address` | string[] | 全部必填 |
| showSaveBtn | 是否显示保存按钮 | boolean | `true` |
| bottomText | 保存按钮文案 | string | `保存` |

以上文案默认值取自 `locale.receiveInvoiceEdit`, 可通过 ConfigProvider 的 `locale` 统一替换。

### InvoiceInfo

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 收票人 | string | `''` |
| tel | 电话号码 | string | `''` |
| region | 所在地区文案 | string | `''` |
| regionIds | 所在地区 id | (string \| number)[] | `[]` |
| address | 详细地址 | string | `''` |

### Events

| 字段 | 说明 | 回调参数 |
| --- | --- | --- |
| onChange | 输入框内容变化 | `(value: string, tag: 'name' \| 'tel' \| 'address')` |
| onAddressChange | 地址弹层中选中地区时触发; 下一级没有数据时自动关闭弹层 | 同 Address 的 onChange |
| onAddressClose | 地址弹层关闭时触发 | 同 Address 的 onClose |
| onSave | 点击保存且校验通过时触发 | `(formData: InvoiceInfo)` |

### 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-receive-invoice-edit-background | `$nb-color-surface` |
| --nb-receive-invoice-edit-label-width | `80px` |
| --nb-receive-invoice-edit-label-color | `$nb-color-title` |
| --nb-receive-invoice-edit-font-size | `$nb-font-size-base` |
| --nb-receive-invoice-edit-placeholder-color | `$nb-color-text-disabled` |
| --nb-receive-invoice-edit-border-color | `$nb-color-border` |
| --nb-receive-invoice-edit-error-color | `$nb-color-primary` |

### 迁移说明 (相对 H5 版)

- 类型 `AddressResult` 更名为 `InvoiceAddressResult` (避免与 AddressEdit 的同名类型冲突)。
- `buttonProps` 为 NutUI React Taro 3.x 的 ButtonProps; 保存按钮默认 `type="primary"`。
- `data.showSaveBtn` 生效; 关闭地址弹层但未选择地区时不再清空已有的所在地区。
