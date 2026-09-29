# AddressList 地址列表

### 介绍

常见于地址管理页面，用于地址列表的展示与操作，支持长按弹出操作菜单、左滑删除。

### 安装

```tsx
import { AddressList } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { AddressList } from 'nutui-biz-taro'

const data = [
  {
    id: 3,
    addressName: '张三',
    phone: '123****4567',
    defaultAddress: false,
    fullAddress: '北京亦庄经济技术开发区科创十一街18号院',
  },
  {
    id: 4,
    addressName: '李四',
    phone: '123****4567',
    defaultAddress: true,
    fullAddress: '北京亦庄经济技术开发区科创十一街18号院',
  },
]

const App = () => (
  <AddressList
    data={data}
    showBottomButton={false}
    onDelIcon={(e, item) => console.log('delete', item)}
    onEditIcon={(e, item) => console.log('edit', item)}
    onItemClick={(e, item) => console.log('click', item)}
  />
)
export default App
```

### 自定义字段映射

data 中的字段名与 IDataInfo 不一致时，通过 `dataMapOptions` 指定映射: 值为字符串时取 data 中对应字段，值为函数时以函数返回值为准。

```tsx
const data = [
  { testid: 5, testaddressName: '王五', phone: '123****4567', defaultAddress: false, testaddressDetail: '北京大兴区京东大厦' },
]

const dataMapOptions = {
  id: 'testid',
  addressName: 'testaddressName',
  fullAddress: 'testaddressDetail',
}

<AddressList data={data} dataMapOptions={dataMapOptions} showBottomButton={false} />
```

### 长按功能

`longPress` 开启后，长按地址 (300ms) 弹出「复制地址 / 设置默认 / 删除地址」操作层；默认地址不显示「设置默认」。点击操作按钮或操作层外部后关闭。

```tsx
<AddressList
  data={data}
  longPress
  showBottomButton={false}
  onLongCopy={(e, item) => console.log('copy', item)}
  onLongSet={(e, item) => console.log('set default', item)}
  onLongDel={(e, item) => console.log('delete', item)}
/>
```

### 滑动功能

`swipeEdition` 开启后，左滑露出删除按钮。`showBottomButton` 为 `true` 时页面底部固定显示「新建地址」按钮。

```tsx
<AddressList
  data={data}
  swipeEdition
  showBottomButton
  onAdd={() => console.log('add')}
  onSwipeDel={(e, item) => console.log('swipe delete', item)}
/>
```

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 地址数组 | IDataInfo[] (或配合 dataMapOptions 的任意对象数组) | `[]` |
| longPress | 是否开启长按操作 | boolean | `false` |
| swipeEdition | 是否开启左滑删除 | boolean | `false` |
| showBottomButton | 是否显示底部「新建地址」按钮 | boolean | `true` |
| dataMapOptions | 字段映射, 见上文 | `{ [key in keyof IDataInfo]?: string \| (item) => any }` | `{}` |

### IDataInfo

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 地址 id | number \| string |
| addressName | 收货人 | string |
| phone | 联系电话 | string |
| defaultAddress | 是否为默认地址 | boolean |
| fullAddress | 详细地址 | string |

### Events

事件回调的 `event` 为 Taro 事件对象 (`ITouchEvent`), `item` 为映射后的 IDataInfo。

| 字段 | 说明 | 回调参数 |
| --- | --- | --- |
| onItemClick | 点击地址 | `(event, item)` |
| onDelIcon | 点击删除图标 | `(event, item)` |
| onEditIcon | 点击编辑图标 | `(event, item)` |
| onAdd | 点击底部「新建地址」按钮 | `(event)` |
| onLongCopy | 长按菜单中点击「复制地址」 | `(event, item)` |
| onLongSet | 长按菜单中点击「设置默认」 | `(event, item)` |
| onLongDel | 长按菜单中点击「删除地址」 | `(event, item)` |
| onSwipeDel | 左滑后点击「删除」 | `(event, item)` |

### 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-address-list-background | `$nb-color-surface` |
| --nb-address-list-border-color | `$nb-color-border` |
| --nb-address-list-color | `$nb-color-title` |
| --nb-address-list-font-size | `$nb-font-size-l` |
| --nb-address-list-addr-color | `$nb-color-text` |
| --nb-address-list-addr-font-size | `$nb-font-size-s` |
| --nb-address-list-icon-color | `$nb-color-text` |
| --nb-address-list-default-background | `$nb-color-primary` |
| --nb-address-list-default-color | `$nb-color-primary-text` |
| --nb-address-list-mask-background | `rgba(0, 0, 0, 0.4)` |
| --nb-address-list-mask-btn-background | `$nb-color-surface` |
| --nb-address-list-mask-btn-color | `$nb-color-title` |
| --nb-address-list-set-background | `$nb-color-warning` |
| --nb-address-list-del-background | `$nb-color-primary` |

### 迁移说明 (相对 H5 版)

- 不传 `dataMapOptions` 时也会正常渲染 (H5 版此时列表为空)。
- 事件参数 `event` 为 Taro 事件; 类型 `functionType` 更名为 `AddressListHandler`。
- 长按菜单点击操作按钮后自动关闭; 未开启 `longPress` 时不再拦截点击。
