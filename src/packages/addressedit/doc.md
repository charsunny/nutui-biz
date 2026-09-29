# AddressEdit 地址编辑

### 介绍

用于新建、编辑收货地址，包含收货人、手机号码、所在地区 (内置 Address 地址选择弹层)、详细地址及默认地址开关，并带必填校验。

### 安装

```tsx
import { AddressEdit } from 'nutui-biz-taro'
```

## 代码演示

### 新增地址

```tsx
import { AddressEdit } from 'nutui-biz-taro'
import type { AddressResult, AddressInfo, AddressData } from 'nutui-biz-taro'

const address: AddressResult = {
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
  type: 'custom',
}

const addressInfo: AddressInfo = {
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
  default: false,
}

const data: Partial<AddressData> = {
  isRequired: ['name', 'tel', 'region', 'address'],
}

const App = () => (
  <AddressEdit
    address={address}
    data={data}
    addressInfo={addressInfo}
    onSave={(formData) => console.log(formData)}
  />
)
export default App
```

### 修改地址

`addressInfo.regionIds` 会同步为地址弹层的默认选中项。`address.type` 为 `elevator` 时以楼层方式展示地区。

```tsx
const addressInfo: AddressInfo = {
  name: '张三',
  tel: '13141234567',
  region: '北京朝阳区八里庄街道',
  regionIds: [1, 7, 3],
  address: 'xxx小区3-2-302',
  default: true,
}

<AddressEdit
  address={{ ...address, type: 'elevator', height: '270px' }}
  data={data}
  addressInfo={addressInfo}
  onSave={(formData) => console.log(formData)}
  onChangeAddress={(cal) => console.log(cal)}
  onCloseAddress={(val) => console.log(val)}
/>
```

### 隐藏保存按钮

`errorShowType: 'toast'` 时必填校验不通过以 Toast 提示。

```tsx
<AddressEdit
  address={address}
  data={{
    nameText: '收件人',
    namePlaceholder: '请输入收件人姓名',
    isRequired: ['name', 'tel'],
    errorShowType: 'toast',
  }}
  addressInfo={addressInfo}
  showSave={false}
  onSwitch={(state, formData) => console.log(state, formData)}
  onChange={(value, tag) => console.log(tag, value)}
/>
```

### 自定义输入框

`bottomInputTpl` 渲染在详细地址下方。可复用组件的 `nb-addressedit__item` / `__row` / `__label` / `__input` class 保持一致的样式。

```tsx
import { View, Text } from '@tarojs/components'
import { Input } from '@nutui/nutui-react-taro'

<AddressEdit
  address={address}
  data={data}
  addressInfo={addressInfo}
  onSave={(formData) => console.log(formData)}
  bottomInputTpl={
    <View className="nb-addressedit__item">
      <View className="nb-addressedit__row">
        <View className="nb-addressedit__label">
          <Text>自定义内容</Text>
        </View>
        <Input className="nb-addressedit__input" plain placeholder="请输入" />
      </View>
    </View>
  }
/>
```

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| address | 地址选择弹层相关数据 | AddressResult | `{}` |
| data | 文案、必填项等设置 | Partial&lt;AddressData&gt; | `{}` |
| addressInfo | 表单初始值 | AddressInfo | `{}` |
| bottomInputTpl | 自定义输入区域 (详细地址下方) | ReactNode | - |
| showSave | 是否显示底部保存按钮 (固定在页面底部) | boolean | `true` |
| showDefault | 是否显示默认地址开关 | boolean | `true` |
| buttonProps | 保存按钮的 props | [ButtonProps](https://nutui.jd.com/taro/react/3x/#/zh-CN/component/button) | - |

### AddressResult

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| addressSelect | 默认选中地区 id (addressInfo.regionIds 非空时以其为准) | (string \| number)[] | `[]` |
| province | 省, 每项必须有 `id`、`name`; type="elevator" 时还需 `title` | RegionData[] | `[]` |
| city | 市 | RegionData[] | `[]` |
| country | 县 | RegionData[] | `[]` |
| town | 乡/镇 | RegionData[] | `[]` |
| addressTitle | 地址选择弹层标题 | string | `请选择所在地区` |
| type | 地址选择类型 `custom` / `elevator` | string | `custom` |
| height | type="elevator" 时列表高度 | string \| number | `270px` |

### AddressData

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 根节点 id | string \| number | - |
| nameText | 收货人文案 | string | `收货人` |
| namePlaceholder | 收货人占位文案 | string | `请输入收货人` |
| nameErrorMsg | 收货人必填错误提示 | string | `该项为必填项，请填写完后提交` |
| telText | 手机号码文案 | string | `手机号码` |
| telPlaceholder | 手机号码占位文案 | string | `请输入手机号码` |
| telErrorMsg | 手机号码必填错误提示 | string | `该项为必填项，请填写完后提交` |
| regionText | 所在地区文案 | string | `所在地区` |
| regionPlaceholder | 所在地区占位文案 | string | `请选择所在地区` |
| regionErrorMsg | 所在地区必填错误提示 | string | `该项为必填项，请填写完后提交` |
| addressText | 详细地址文案 | string | `详细地址` |
| addressPlaceholder | 详细地址占位文案 | string | `街道、楼牌号` |
| addressErrorMsg | 详细地址必填错误提示 | string | `该项为必填项，请填写完后提交` |
| isRequired | 必填项, 可选 `name` / `tel` / `region` / `address` | string[] | 全部必填 |
| bottomText | 保存按钮文案 | string | `保存` |
| errorShowType | 必填错误提示方式 `errorMsg` (输入框下方) / `toast` | string | `errorMsg` |
| errorToastText | Toast 提示内容 | string | `请填写必填项` |

以上文案默认值取自 `locale.addressedit`, 可通过 ConfigProvider 的 `locale` 统一替换。

### AddressInfo

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 收货人 | string | `''` |
| tel | 手机号码 (只保留数字, 最多 11 位) | string | `''` |
| region | 所在地区文案 | string | `''` |
| regionIds | 所在地区 id | (string \| number)[] | `[]` |
| address | 详细地址 | string | `''` |
| default | 是否默认地址 | boolean | `false` |

### Events

| 字段 | 说明 | 回调参数 |
| --- | --- | --- |
| onChange | 输入框内容变化 | `(value: string, tag: 'name' \| 'tel' \| 'address')` |
| onChangeAddress | 地址弹层中选中地区时触发 | 同 Address 的 onChange |
| onCloseAddress | 地址弹层关闭时触发 | 同 Address 的 onClose |
| onSave | 点击保存且校验通过时触发 | `(formData: AddressInfo)` |
| onSwitch | 切换默认地址开关 | `(state: boolean, formData: AddressInfo)` |

### 主题定制

| 名称 | 默认值 |
| --- | --- |
| --nb-addressedit-background | `$nb-color-surface` |
| --nb-addressedit-label-width | `80px` |
| --nb-addressedit-label-color | `$nb-color-title` |
| --nb-addressedit-font-size | `$nb-font-size-base` |
| --nb-addressedit-placeholder-color | `$nb-color-text-disabled` |
| --nb-addressedit-border-color | `$nb-color-border` |
| --nb-addressedit-error-color | `$nb-color-primary` |

### 迁移说明 (相对 H5 版)

- 输入框改用 NutUI 3 `Input` + 自绘的标签/必填星号/错误提示行; 所在地区改为可点击的只读行。
- `buttonProps` 为 NutUI React Taro 3.x 的 ButtonProps; 保存按钮默认 `type="primary"`。
- `errorShowType` 的取值为 `errorMsg` / `toast` (类型 `showErrorType` 同步修正)。
- 必填校验失败且 `errorShowType: 'toast'` 时使用 `errorToastText` 作为提示内容。
- 地区 id 解析修正: `addressIdStr` 取到第一个 0 为止, 不再误删最后一级。
