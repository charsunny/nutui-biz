# InvoiceTitleList 发票抬头列表

### 介绍

发票抬头列表中的单项展示, 支持默认标识、选中态、审批状态与编辑 / 删除操作。依赖 NutUI 组件: Button。

### 安装

```tsx
import { InvoiceTitleList } from 'nutui-biz-taro'
```

## 代码演示

### 增值税专用发票

增值税专用发票 (`type: 'special'`) 展示审批状态 `status`: `pass` 通过、`approval` 审批中、`veto` 否决。

```tsx
import { InvoiceTitleList } from 'nutui-biz-taro'

const App = () => (
  <InvoiceTitleList
    data={{
      type: 'special',
      status: 'pass',
      title: '北京环球影城娱乐信息技术有限公司',
      companyCode: '91110302MA222LU88A',
      address: '北京市通州区台湖镇',
      companyPhone: '88488848',
      bankDeposit: '中国银行股份有限公司北京分行',
      bankAccount: '5833 2153 4243 2654',
    }}
    onClick={(data) => console.log('click', data)}
    onEdit={(data) => console.log('edit', data)}
    onDelete={(data) => console.log('delete', data)}
  />
)
```

### 电子普通发票 / 是否默认 / 是否选中

```tsx
<InvoiceTitleList data={{ ...data, type: 'normal' }} />
<InvoiceTitleList data={{ ...data, type: 'normal', isShowDefault: true }} />
<InvoiceTitleList data={{ ...data, type: 'normal', isSelected: true }} />
```

### 操作按钮自定义

```tsx
import { Button } from '@nutui/nutui-react-taro'

<InvoiceTitleList data={data} otherOperate={<Button size="small">同步到电子发票</Button>} />
```

### 隐藏所有操作

```tsx
<InvoiceTitleList data={{ ...data, isDelete: false, isEdit: false }} />
```

## API

### Props

| 字段         | 说明                         | 类型             | 默认值 |
| ------------ | ---------------------------- | ---------------- | ------ |
| data         | 发票信息，未传的字段取下表默认值 | Partial\<Idata\> | -      |
| infoFields   | 展示哪些信息行 (按此顺序)，可选 `companyCode` `address` `companyPhone` `bankDeposit` `bankAccount` | InvoiceTitleInfoField[] | 全部 |
| otherOperate | 扩展其他操作 (放在删除/编辑按钮之前) | ReactNode        | -      |
| className    | 根节点类名                   | string           | -      |
| style        | 根节点样式                   | CSSProperties    | -      |

### Idata (导出名 `InvoiceTitleListData`)

| 字段          | 说明                                                             | 类型    | 默认值    |
| ------------- | ---------------------------------------------------------------- | ------- | --------- |
| isSelected    | 是否选中                                                         | boolean | `false`   |
| type          | 发票类型：`normal` 电子普通发票，`special` 增值税专用发票         | string  | `special` |
| status        | 审批状态 `pass` `approval` `veto`，仅增值税专用发票展示           | string  | `pass`    |
| isShowDefault | 是否展示 "默认" 标识                                             | boolean | `false`   |
| title         | 发票抬头                                                         | string  | `-`       |
| companyCode   | 纳税人识别号                                                     | string  | `-`       |
| address       | 注册地址                                                         | string  | `-`       |
| companyPhone  | 公司电话                                                         | string  | `-`       |
| bankDeposit   | 开户行                                                           | string  | `-`       |
| bankAccount   | 银行账户                                                         | string  | `-`       |
| isDelete      | 是否展示删除按钮                                                 | boolean | `true`    |
| isEdit        | 是否展示编辑按钮                                                 | boolean | `true`    |

### Events

| 字段     | 说明         | 回调参数      |
| -------- | ------------ | ------------- |
| onClick  | 点击发票信息 | `data: Idata` |
| onEdit   | 点击编辑     | `data: Idata` |
| onDelete | 点击删除     | `data: Idata` |

## 主题定制

| 名称                                        | 默认值                 |
| ------------------------------------------- | ---------------------- |
| --nb-invoice-title-list-background          | `$nb-color-surface`    |
| --nb-invoice-title-list-radius              | `10px`                 |
| --nb-invoice-title-list-title-color         | `$nb-color-title`      |
| --nb-invoice-title-list-label-color         | `$nb-color-text-help`  |
| --nb-invoice-title-list-default-background  | `$nb-color-primary`    |
| --nb-invoice-title-list-checked-color       | `$nb-color-primary`    |
| --nb-invoice-title-list-veto-color          | `$nb-color-primary`    |
| --nb-invoice-title-list-approval-color      | `$nb-color-warning`    |
