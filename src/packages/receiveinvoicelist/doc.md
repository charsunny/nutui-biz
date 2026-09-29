# ReceiveInvoiceList 收票人列表

### 介绍

展示收票人列表信息，支持单选、编辑与左滑删除。

### 安装

```tsx
import { ReceiveInvoiceList } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { ReceiveInvoiceList } from 'nutui-biz-taro'
import type { ReceiveInvoiceItem } from 'nutui-biz-taro'

const list: ReceiveInvoiceItem[] = [
  { id: 1, name: '张三', tel: '15088888888', addres: '北京市大兴京东大厦1号楼', isDefault: true },
  {
    id: 2,
    name: '李四',
    tel: '15088888888',
    addres: '北京市大兴京东大厦2号楼',
    isDefault: false,
    extends: [
      { label: '扩展1', value: '扩展信息展示' },
      { label: '扩展2', value: '扩展信息展示' },
    ],
  },
]

const App = () => (
  <ReceiveInvoiceList
    list={list}
    defaultValue={1}
    onSelected={(item, index) => console.log('onSelected', item, index)}
    onEdit={(item, index) => console.log('onEdit', item, index)}
  />
)
export default App
```

### 使用左滑删除

```tsx
<ReceiveInvoiceList
  enableDelete
  list={list}
  defaultValue={1}
  onSelected={(item, index) => console.log('onSelected', item, index)}
  onEdit={(item, index) => console.log('onEdit', item, index)}
  onDelete={(item, index) => console.log('onDelete', item, index)}
/>
```

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 当前选中联系人的 id, 变化时同步 | number \| string | `''` |
| list | 联系人列表 | ReceiveInvoiceItem[] | `[]` |
| enableDelete | 是否启用左滑删除 | boolean | `false` |
| deselectable | 再次点击已选中项是否取消选中 (选中态代表业务状态时传 `false`) | boolean | `true` |
| customEdit | 自定义编辑按钮 | ReactNode | `<Edit />` |

### ReceiveInvoiceItem

| 键名 | 说明 | 类型 |
| --- | --- | --- |
| id | 联系人 id | number \| string |
| name | 联系人姓名 | string |
| tel | 联系人手机号 | string |
| addres | 联系人地址 | string |
| isDefault | 是否为默认地址 | boolean |
| extends | 扩展信息 | ReceiveInvoiceItemExt[] |

### ReceiveInvoiceItemExt

| 键名 | 说明 | 类型 |
| --- | --- | --- |
| label | 字段名称 | string |
| value | 字段值 | string |

### Events

| 字段 | 说明 | 回调参数 |
| --- | --- | --- |
| onEdit | 点击编辑按钮 | `(item: ReceiveInvoiceItem, index: number)` |
| onSelected | 选中某一项 (再次点击已选中项会取消选中, 不触发该事件) | `(item: ReceiveInvoiceItem, index: number)` |
| onDelete | 左滑后点击删除 | `(item: ReceiveInvoiceItem, index: number)` |

### 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-receive-invoice-list-name-color | `$nb-color-title` |
| --nb-receive-invoice-list-name-font-size | `$nb-font-size-base` |
| --nb-receive-invoice-list-label-color | `$nb-color-text-help` |
| --nb-receive-invoice-list-value-color | `$nb-color-title` |
| --nb-receive-invoice-list-row-font-size | `$nb-font-size-s` |
| --nb-receive-invoice-list-edit-color | `$nb-color-text` |
| --nb-receive-invoice-list-gap | `$nb-spacing-s` |
