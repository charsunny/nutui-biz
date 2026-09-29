# Address 地址

### 介绍

常见于购物车页、地址管理页面等，以底部弹层的形式选择配送地址。支持逐级选择省市区、楼层 (Elevator) 展示、异步加载下一级，以及从已有地址列表中选择。

### 安装

```tsx
import { Address } from 'nutui-biz-taro'
```

## 代码演示

### 选择自定义地址

选中上一级后，在 `onChange` 里给出下一级数据；没有下一级时关闭弹层。

```tsx
import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { Address } from 'nutui-biz-taro'
import type { ChangeCallBack, CloseCallBack, CloseCallBackData } from 'nutui-biz-taro'

const province = [
  { id: 1, name: '北京', title: 'B' },
  { id: 2, name: '广西', title: 'G' },
  { id: 3, name: '江西', title: 'J' },
]

const App = () => {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('请选择地址')
  const [city, setCity] = useState<any[]>([])
  const [country, setCountry] = useState<any[]>([])

  const onChange = (cal: ChangeCallBack) => {
    setTimeout(() => {
      if (cal.next === 'city') {
        setCity([
          { id: 7, name: '朝阳区', title: 'C' },
          { id: 8, name: '崇文区', title: 'C' },
        ])
      } else if (cal.next === 'country') {
        setCountry([
          { id: 3, name: '八里庄街道', title: 'B' },
          { id: 9, name: '北苑', title: 'B' },
        ])
      } else {
        setVisible(false)
      }
    }, 200)
  }

  const onClose = (val: CloseCallBack) => {
    const data = val.data as CloseCallBackData
    if (data.addressStr) setText(data.addressStr)
    setVisible(false)
  }

  return (
    <>
      <Cell title="选择地址" extra={text} onClick={() => setVisible(true)} />
      <Address
        modelValue={visible}
        province={province}
        city={city}
        country={country}
        customAddressTitle="请选择所在地区"
        onChange={onChange}
        onClose={onClose}
      />
    </>
  )
}
export default App
```

### 选中省市区

在 `modelSelect` 中按 province、city、country、town 的顺序传入地区 id，并保证对应层级的数据已传入即可。

```tsx
const [select, setSelect] = useState<(string | number)[]>([1, 7, 3])

<Address
  modelValue={visible}
  modelSelect={select}
  province={province}
  city={city}
  country={country}
  onChange={(cal) => cal.next === 'town' && setVisible(false)}
  onClose={(val) => {
    setSelect((val.data as CloseCallBackData).addressIdStr.split('_'))
    setVisible(false)
  }}
/>
```

### 楼层展示地址信息

`type="elevator"` 时按首字母楼层展示，每个地区对象必须有 `title` 字段 (首字母)。`height` 为列表区域高度。

```tsx
<Address
  modelValue={visible}
  type="elevator"
  modelSelect={[1, 7, 3]}
  province={province}
  city={city}
  country={country}
  height="270px"
  onChange={(cal) => cal.next === 'town' && setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 异步加载

`onClickItem(cal, resolve)` 中请求下一级数据, 完成后调用 `resolve(true)` 切换到下一级; 调用 `resolve(false)` 表示没有下一级, 会关闭弹层并触发 `onClose`。请求期间把 `loading` 设为 `true`, 被点击的地区前会显示加载图标。

```tsx
const [loading, setLoading] = useState(false)
const [city, setCity] = useState<any[]>([])
const [country, setCountry] = useState<any[]>([])

const onClickItem = (cal: ChangeCallBack, resolve: (ok: boolean) => void) => {
  setLoading(true)
  fetchNext(cal.next, cal.value.id).then((list) => {
    setLoading(false)
    if (cal.next === 'city') setCity(list)
    else if (cal.next === 'country') setCountry(list)
    else return resolve(false)
    resolve(true)
  })
}

<Address
  modelValue={visible}
  province={province}
  city={city}
  country={country}
  loading={loading}
  onClickItem={onClickItem}
  onClose={() => setVisible(false)}
/>
```

### 选择已有地址

```tsx
const existAddress = [
  {
    id: 1,
    provinceName: '北京市',
    cityName: '通州区',
    countyName: '次渠镇',
    townName: '',
    addressDetail: '',
    selectedAddress: true,
    name: 'Ames',
    phone: '182****1718',
  },
  {
    id: 2,
    provinceName: '北京市',
    cityName: '大兴区',
    countyName: '科创十一街18号院',
    townName: '',
    addressDetail: '京东大厦',
    selectedAddress: false,
    name: 'Cobe',
    phone: '182****1718',
  },
]

<Address
  modelValue={visible}
  type="exist"
  existAddress={existAddress}
  isShowCustomAddress={false}
  existAddressTitle="配送至"
  onSelected={(prev, now, list) => console.log(prev, now, list)}
  onClose={() => setVisible(false)}
/>
```

### 自定义图标

图标一律传 ReactNode, 推荐使用 `@nutui/icons-react-taro`。

```tsx
import { Heart, HeartFill, MaskClose } from '@nutui/icons-react-taro'

<Address
  modelValue={visible}
  type="exist"
  existAddress={existAddress}
  isShowCustomAddress={false}
  defaultIcon={<Heart size={13} />}
  selectedIcon={<HeartFill size={13} />}
  closeBtnIcon={<MaskClose size={18} />}
  onClose={() => setVisible(false)}
/>
```

### 自定义地址与已有地址切换

`type="exist"` 且 `isShowCustomAddress` 为 `true` 时，底部显示「选择其他地址」按钮，可切换到自定义地址选择；左上角的返回按钮 (`backBtnIcon`) 可切回已有地址。

```tsx
import { ArrowLeftSmall } from '@nutui/icons-react-taro'

<Address
  modelValue={visible}
  type="exist"
  existAddress={existAddress}
  province={province}
  city={city}
  country={country}
  backBtnIcon={<ArrowLeftSmall size={16} />}
  customAndExistTitle="选择其他地址"
  onChange={onChange}
  onClose={() => setVisible(false)}
  onSwitchModule={(val) => console.log(val.type)}
  onCloseMask={(val) => console.log(val.closeWay)}
/>
```

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否打开地址选择 | boolean | `false` |
| modelSelect | 默认选中地址, 按 province、city、country、town 顺序的 id 数组 | (string \| number)[] | `[]` |
| type | 地址选择类型 `exist` / `custom` / `elevator` | string | `custom` |
| province | 省, 每项必须有 `id`、`name`, type="elevator" 时还需 `title` (首字母) | RegionData[] | `[]` |
| city | 市, 同上 | RegionData[] | `[]` |
| country | 县, 同上 | RegionData[] | `[]` |
| town | 乡/镇, 同上; 有数据时才显示第 4 级 | RegionData[] | `[]` |
| height | 列表区域高度, 仅 type="elevator" 时生效 | string \| number | `200px` |
| existAddress | 已有地址列表, 字段见下方 AddressExistItem | AddressExistItem[] | `[]` |
| defaultIcon | 已有地址列表默认图标, type="exist" 时生效 | ReactNode | `<Location />` |
| selectedIcon | 已有地址列表选中图标, type="exist" 时生效 | ReactNode | `<Check />` |
| closeBtnIcon | 右上角关闭按钮图标, 传 `null` 不显示 | ReactNode | `<Close />` |
| backBtnIcon | 已有地址切到自定义地址后, 左上角返回按钮图标, 传 `null` 不显示 | ReactNode | `<ArrowLeft />` |
| isShowCustomAddress | 是否显示「选择其他地址」按钮, type="exist" 时生效 | boolean | `true` |
| customAddressTitle | 自定义地址选择标题 | ReactNode | `请选择所在地区` |
| existAddressTitle | 已有地址标题, type="exist" 时生效 | ReactNode | `配送至` |
| customAndExistTitle | 「选择其他地址」按钮文案, type="exist" 时生效 | ReactNode | `选择其他地址` |
| loading | 是否处于加载中 (配合 onClickItem), type="custom"/"elevator" 时生效 | boolean | `false` |
| bottom | 弹层底部自定义内容 | ReactNode | - |

### AddressExistItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 地址 id | string \| number |
| provinceName | 省名 | string |
| cityName | 市名 | string |
| countyName | 县名 | string |
| townName | 乡/镇名 | string |
| addressDetail | 详细地址 | string |
| selectedAddress | 是否为当前选中项 | boolean |
| name | 收货人 (与 phone 同时存在时展示) | string |
| phone | 电话 | string |

### Events

| 字段 | 说明 | 回调参数 |
| --- | --- | --- |
| onChange | 自定义地址选择时, 选中地区后触发 | 参考 onChange |
| onSelected | 选择已有地址时触发 | 参考 onSelected |
| onClose | 弹层关闭时触发 (选择完成、点遮罩、点关闭按钮、modelValue 置为 false) | 参考 onClose |
| onClickItem | 点击地区时触发, 用于异步加载下一级 | 参考 onClickItem |
| onCloseMask | 点击遮罩或右上角关闭按钮时触发 | `{ closeWay: 'mask' \| 'cross' }` |
| onSwitchModule | 点击「选择其他地址」或左上角返回按钮时触发, type 为切换后的类型 | `{ type: 'exist' \| 'custom' }` |
| onTabChecked | 点击地区 tab 时触发 | `'province' \| 'city' \| 'country' \| 'town'` |

### onChange 回调参数

| 参数 | 说明 | 可能值 |
| --- | --- | --- |
| custom | 当前点击的行政区域 | province / city / country / town |
| next | 下一级行政区域, 已是第 4 级时为 `''` | city / country / town / `''` |
| value | 当前点击的地区对象 (传入的原值) | RegionData |

### onSelected 回调参数

| 参数 | 说明 |
| --- | --- |
| prevExistAdd | 选择前选中的地址 |
| nowExistAdd | 当前选中的地址 |
| arr | 选择后的已有地址列表 (新数组, `selectedAddress` 已更新, 不修改传入的 existAddress) |

### onClose 回调参数

| 参数 | 说明 | 可能值 |
| --- | --- | --- |
| type | 当前地址选择类型 | exist / custom / elevator |
| data | type 为 exist 时是选中的已有地址; 否则为已选地区, 含 `addressStr` (名称拼接) 与 `addressIdStr` (id 以 `_` 连接, 未选为 0, 如 `1_7_3_0`) | {} |

### onClickItem 回调参数

| 参数 | 说明 |
| --- | --- |
| cal | 当前点击地区信息, 与 onChange 参数相同 |
| resolve | `resolve(true)` 切换到下一级; `resolve(false)` 关闭弹层并触发 `onClose` |

### 主题定制

组件提供以下 CSS 变量，可通过 ConfigProvider 的 `theme` 或样式覆写：

| 名称 | 默认值 |
| --- | --- |
| --nb-address-background | `$nb-color-surface` |
| --nb-address-header-title-color | `$nb-color-title` |
| --nb-address-header-title-font-size | `$nb-font-size-xl` |
| --nb-address-header-icon-color | `$nb-color-text-disabled` |
| --nb-address-region-tab-color | `$nb-color-title` |
| --nb-address-region-tab-font-size | `13px` |
| --nb-address-region-tab-line | `$nb-color-primary-gradient` |
| --nb-address-region-item-color | `$nb-color-title` |
| --nb-address-region-item-font-size | `$nb-font-size-base` |
| --nb-address-icon-color | `$nb-color-primary` |
| --nb-address-list-height | `270px` |
| --nb-address-exist-height | `279px` |
| --nb-address-border-color | `$nb-color-border` |

### 迁移说明 (相对 H5 版)

- `closeBtnIcon` / `backBtnIcon` 由 icon 名字符串改为 ReactNode; 移除 `iconClassPrefix` / `iconFontClassName`。
- `onSwitchModule` 回调的 `type` 为切换**后**的类型。
- `onCloseMask` 点击右上角关闭按钮时也会触发 (`closeWay: 'cross'`)。
- 当前 tab 已选中地区时显示地区名 (原先显示「请选择」)。
- 选择某一级后会清空其后各级已选值。
