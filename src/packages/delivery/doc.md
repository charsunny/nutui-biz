#  Delivery 配送

### 介绍

支持配送方式和配送时间选择。配送时间支持三种展示形式, 对应的子组件 `DeliveryDate`、`DeliveryDateTime`、`DeliveryDateTimeAccurate` 也可单独使用。

### 安装

```tsx
import { Delivery, DeliveryDate, DeliveryDateTime, DeliveryDateTimeAccurate } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

`label` 为 `jd` 的配送方式下展示配送时间选择; 其他配送方式可通过 `children` 自定义内容。

```tsx
import { useState } from 'react'
import { View } from '@tarojs/components'
import { Cell } from '@nutui/nutui-react-taro'
import { Delivery } from 'nutui-biz-taro'
import type { DateTimesType, DateType, DeliveryData, DeliveryTypes } from 'nutui-biz-taro'

const deliveryTypes: DeliveryTypes[] = [
  { label: 'jd', text: '京东快递', desc: '若社区村镇人员出入管控，京东快递可送货上门' },
  {
    label: 'jc',
    text: '无接触配送',
    desc: '无接触配送，自定义',
    children: <View style={{ padding: '0 20px', fontSize: '12px' }}>可选择无接触配送点</View>,
  },
]

const App = () => {
  const [visible, setVisible] = useState(false)
  const [desc, setDesc] = useState('')
  const [data, setData] = useState<DeliveryData[]>([
    {
      label: '1',
      text: '时间配送',
      desc: '可按照具体时间配送',
      type: 'date',
      times: [
        { label: '1', text: '2月28日(周二)', selected: true },
        { label: '2', text: '3月1日(周三)', disabled: true },
        { label: '3', text: '3月2日(周四)' },
        { label: '4', text: '3月3日(周五)' },
      ],
    },
  ])

  const onSure = (item: DateTimesType | null, type: string) => {
    const deliveryType = deliveryTypes.find((value) => value.label === type)
    if (!item) {
      setDesc(String(deliveryType?.text))
      return
    }
    setDesc([deliveryType?.text, (item as DateType).text].join(','))
    // 把选中项写回 selected, 下次打开时默认选中
    setData((prev) =>
      prev.map((d) => ({
        ...d,
        times: (d.times as DateType[]).map((t) => ({ ...t, selected: t.label === item.label || undefined })),
      }))
    )
  }

  return (
    <>
      <Cell title="请选择" extra={desc} clickable onClick={() => setVisible(true)} />
      <Delivery
        visible={visible}
        deliveryTypes={deliveryTypes}
        deliveryTimeTitle={<View>送货时间</View>}
        deliveryDateData={data}
        onCloseMask={() => setVisible(false)}
        onClose={() => setVisible(false)}
        onSure={onSure}
      />
    </>
  )
}
export default App
```

### 标准达、京准达

`type` 为 `date-time` 时左侧为日期、右侧为时间段; `date-time-accurate` 时右侧再按上午/下午等分组。
`onSure` 的第三个参数是当前配送时间 tab 的 `label`, 可据此区分回调数据的结构。

```tsx
import { useState } from 'react'
import { View } from '@tarojs/components'
import { Cell } from '@nutui/nutui-react-taro'
import { Delivery } from 'nutui-biz-taro'
import type { DateTimeAccurateType, DateTimesType, DateTimeType, DeliveryData } from 'nutui-biz-taro'

const slot = (label: string, time: string, fee: string, disabled?: boolean) => ({
  label,
  disabled,
  text: (
    <View>
      <View style={{ lineHeight: '2' }}>{time}</View>
      <View style={{ lineHeight: '1', fontSize: '12px' }}>{fee}</View>
    </View>
  ),
})

const data: DeliveryData[] = [
  {
    label: '1',
    text: '标准达',
    desc: '标准达配送时间',
    type: 'date-time',
    times: [
      {
        label: '1',
        title: '2月28日(周二)',
        children: [
          { label: '11', text: '09:00-15:00', selected: true },
          { label: '22', text: '15:00-18:00' },
        ],
      },
      {
        label: '2',
        title: '3月1日(周三)',
        children: [
          { label: '33', text: '09:00-15:00' },
          { label: '44', text: '16:00-18:00' },
        ],
      },
    ],
  },
  {
    label: '2',
    text: '京准达',
    desc: '京准达配送时间',
    type: 'date-time-accurate',
    times: [
      {
        label: '1',
        title: '3月1日(周三)',
        children: [
          { label: '11', title: '上午', children: [slot('333', '09:00-10:00', '加收3元运费', true), slot('444', '10:00-11:00', '加收5元运费')] },
          { label: '22', title: '晚间', children: [slot('555', '15:00-18:00', '加收3元运费')] },
        ],
      },
      {
        label: '2',
        title: '3月2日(周四)',
        children: [
          { label: '22', title: '中午', children: [slot('666', '12:00-14:00', '加收3元运费')] },
          { label: '24', title: '晚间', children: [slot('888', '19:00-21:00', '加收10元运费')] },
        ],
      },
    ],
  },
]

const App = () => {
  const [visible, setVisible] = useState(false)
  const [desc, setDesc] = useState('')

  const onSure = (item: DateTimesType | null, type: string, deliveryTime: string) => {
    if (!item) return
    if (deliveryTime === '2') {
      const picked = item as DateTimeAccurateType
      setDesc(['京东快递', picked.title, picked.children[0].title].join(','))
    } else {
      const picked = item as DateTimeType
      setDesc(['京东快递', picked.title, picked.children[0].text].join(','))
    }
  }

  return (
    <>
      <Cell title="请选择" extra={desc} clickable onClick={() => setVisible(true)} />
      <Delivery
        visible={visible}
        deliveryDateData={data}
        onCloseMask={() => setVisible(false)}
        onClose={() => setVisible(false)}
        onSure={onSure}
      />
    </>
  )
}
export default App
```

### 自定义内容

`children` 渲染在配送方式与确定按钮之间, 可配合子组件在另一个弹层里选择时间。

```tsx
import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { Cell, Popup } from '@nutui/nutui-react-taro'
import { Delivery, DeliveryDate } from 'nutui-biz-taro'
import type { DateType } from 'nutui-biz-taro'

const dates: DateType[] = [
  { label: '1', text: '2月28日(周二)' },
  { label: '2', text: '3月1日(周三)' },
  { label: '3', text: '3月2日(周四)' },
]

const App = () => {
  const [visible, setVisible] = useState(false)
  const [dateVisible, setDateVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('1')
  const [desc, setDesc] = useState('')

  return (
    <>
      <Cell title="请选择" extra={desc} clickable onClick={() => setVisible(true)} />
      <Delivery
        visible={visible}
        onCloseMask={() => setVisible(false)}
        onClose={() => setVisible(false)}
        onSure={() => console.log(desc)}
      >
        <View style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }} onClick={() => setDateVisible(true)}>
          <Text>请选择送货时间 {desc}</Text>
          <Text>...</Text>
        </View>
      </Delivery>
      <Popup
        visible={dateVisible}
        position="bottom"
        title="选择送货时间"
        style={{ height: '80%', display: 'flex', flexDirection: 'column' }}
        overlayStyle={{ backgroundColor: 'transparent' }}
        closeable
        round
        onClose={() => setDateVisible(false)}
      >
        <DeliveryDate
          style={{ flex: 1, minHeight: 0 }}
          activeKey={activeKey}
          data={dates}
          onSelect={(item) => {
            setActiveKey(item.label)
            setDesc(String(item.text))
            setDateVisible(false)
          }}
        />
      </Popup>
    </>
  )
}
export default App
```

`DeliveryDateTime` 的用法相同, `onSelect` 回调的是所在日期 (其 `children` 只包含选中的时间段)。

### 子组件单独使用

子组件的高度为 100%, 放在固定高度的容器里即可纵向滚动。

```tsx
import { useState } from 'react'
import { Cell, Popup } from '@nutui/nutui-react-taro'
import { DeliveryDate } from 'nutui-biz-taro'

const App = () => {
  const [visible, setVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('1')
  const [desc, setDesc] = useState('')
  const dates = [
    { label: '1', text: '2月28日(周二)' },
    { label: '2', text: '3月1日(周三)' },
    { label: '3', text: '3月2日(周四)' },
  ]
  return (
    <>
      <Cell title="请选择" extra={desc} clickable onClick={() => setVisible(true)} />
      <Popup
        visible={visible}
        position="bottom"
        title="选择送货时间"
        style={{ height: '80%', display: 'flex', flexDirection: 'column' }}
        closeable
        round
        onClose={() => setVisible(false)}
      >
        <DeliveryDate
          style={{ flex: 1, minHeight: 0 }}
          activeKey={activeKey}
          data={dates}
          onSelect={(item) => {
            setActiveKey(item.label)
            setDesc(String(item.text))
            setVisible(false)
          }}
        />
      </Popup>
    </>
  )
}
export default App
```

## API

### Delivery Props

| 字段 | 说明 | 类型 | 默认值 |
|----- | ----- | ----- | -----  |
| visible | 组件的显示/隐藏 | boolean | `false` |
| title | 组件的标题 | ReactNode | `配送` (locale `delivery.title`) |
| deliveryTypes | 配送方式, 最多展示三种; `label` 为 `jd` 的配送方式下展示配送时间选择 | DeliveryTypes[] | `[{ label: 'jd', text: '京东快递' }]` |
| deliveryTimeTitle | 配送时间的标题 | ReactNode | `送货时间` (locale `delivery.deliveryTimeTitle`) |
| deliveryDateData | 配送时间的数据, 最多展示三个 | DeliveryData[] | `[]` |
| buttonText | 确定按钮文案 | ReactNode | `确定` (locale `delivery.buttonText`) |
| popStyle | 弹出层 (Popup) 样式 | CSSProperties | `{ height: '80%' }` |
| popClassName | 弹出层 (Popup) 类名 | string | - |
| duration | 弹出层动画时长, **单位 ms** | number | `300` |
| className | 内容区类名 | string | - |
| style | 内容区样式 | CSSProperties | - |
| children | 自定义内容, 渲染在配送时间与确定按钮之间 | ReactNode | - |

打开时的默认选中:
- 配送方式: `label` 为 `jd` 的可选项, 没有则取第一个可选项。
- 配送时间 tab: 含 `selected` 时间的 tab (多个时取最后一个), 否则第一个可选 tab。
- 每个 tab 的时间: `selected` 的项, 否则第一个可选项 (与子组件默认高亮的一致)。

### Delivery Events

| 字段 | 说明 | 回调参数 |
|----- | ----- | -----  |
| onCloseMask | 点击遮罩层或关闭图标 | - |
| onClose | 弹层关闭 (遮罩层 / 关闭图标 / 确定按钮) | - |
| onSure | 点击确定按钮 | (item: 当前配送时间 tab 下选中的时间 `DateTimesType \| null`, 非 `jd` 配送方式时为 `null`; type: 配送方式的 label `string`; deliveryTime: 配送时间 tab 的 label `string`) |
| onDeliveryTypeChange | 切换配送方式 | (label: 配送方式的 label `string`) |

### DeliveryDate Props

| 字段 | 说明 | 类型 | 默认值 |
|----- | ----- | ----- | -----  |
| data | 配送时间的数据 | DateType[] | `[]` |
| activeKey | 当前选中项的 label; 不传或 `9999` 时取 `selected` 项, 否则第一个可选项 | string \| number | - |

### DeliveryDate Events

| 字段 | 说明 | 回调参数 |
|----- | ----- | -----  |
| onSelect | 选中某个时间 | (item: 选中的时间 `DateType`) |

### DeliveryDateTime Props

| 字段 | 说明 | 类型 | 默认值 |
|----- | ----- | ----- | -----  |
| data | 配送时间的数据 | DateTimeType[] | `[]` |
| activeKey | 默认展示的左侧日期 label; 不传或 `9999` 时取含 `selected` 项的日期, 否则第一个 | string \| number | - |

### DeliveryDateTime Events

| 字段 | 说明 | 回调参数 |
|----- | ----- | -----  |
| onSelect | 选中某个时间段 | (item: 所在日期 `DateTimeType`, 其 `children` 只含选中的时间段) |

### DeliveryDateTimeAccurate Props

| 字段 | 说明 | 类型 | 默认值 |
|----- | ----- | ----- | -----  |
| data | 配送时间的数据 | DateTimeAccurateType[] | `[]` |
| activeKey | 默认展示的左侧日期 label; 不传或 `9999` 时取含 `selected` 项的日期, 否则第一个 | string \| number | - |

### DeliveryDateTimeAccurate Events

| 字段 | 说明 | 回调参数 |
|----- | ----- | -----  |
| onSelect | 选中某个时间段 | (item: 所在日期 `DateTimeAccurateType`, 其 `children` 只含选中的分组, 分组的 `children` 只含选中的时间段) |

### 数据结构

以下类型均可从 `nutui-biz-taro` 引入。

#### DeliveryDateType 配送时间展示形式

`'date' | 'date-time' | 'date-time-accurate'`

#### DateType (type = 'date')

| 字段    | 说明                 | 类型    |
|---------|-----------------------|---------|
| label | 唯一标识 | string |
| text | 内容 | ReactNode |
| selected | 可选，是否默认选中 | boolean |
| disabled | 可选，是否禁用 | boolean |

#### DateTimeType (type = 'date-time')

| 字段    | 说明                 | 类型    |
|---------|-----------------------|---------|
| label | 唯一标识 | string |
| title | 左侧日期内容 | ReactNode |
| children | 右侧时间段 | DateType[] |

#### DateTimeAccurateType (type = 'date-time-accurate')

| 字段    | 说明                 | 类型    |
|---------|-----------------------|---------|
| label | 唯一标识 | string |
| title | 左侧日期内容 | ReactNode |
| children | 右侧分组, 每组含若干时间段 | DateTimeType[] |

#### DateTimesType

`DateType | DateTimeType | DateTimeAccurateType`

#### DeliveryTypes 配送方式

| 字段    | 说明                 | 类型    |
|---------|-----------------------|---------|
| label | 唯一标识 | string |
| text | 内容 | ReactNode |
| disabled | 是否禁用 | boolean |
| desc | 具体描述信息 | ReactNode |
| children | 自定义该配送方式下的内容 (替换配送时间选择) | ReactNode |

#### DeliveryData 配送时间数据, 继承 DeliveryTypes

| 字段    | 说明                 | 类型    |
|---------|-----------------------|---------|
| label | 唯一标识 | string |
| text | tab 文案 | ReactNode |
| disabled | 是否禁用 | boolean |
| desc | 具体描述信息 | ReactNode |
| type | 配送时间展示形式 | DeliveryDateType |
| times | 具体的时间内容 | DateTimesType[] |

## 主题定制

组件使用 CSS 变量, 可通过 ConfigProvider 的 `theme` 或直接覆写:

| 名称 | 默认值 |
| --- | --- |
| --nb-delivery-title-color | `$nb-color-title` |
| --nb-delivery-title-font-size | `$nb-font-size-l` |
| --nb-delivery-subtitle-color | `$nb-color-title` |
| --nb-delivery-tips-color | `$nb-color-text` |
| --nb-delivery-padding | `$nb-spacing-xl` |
| --nb-delivery-btn-background | `$nb-color-surface` |
| --nb-delivery-date-item-background | `$nb-color-surface-variant` |
| --nb-delivery-date-item-color | `$nb-color-title` |
| --nb-delivery-date-item-height | `50px` |
| --nb-delivery-date-item-radius | `$nb-radius-xs` |
| --nb-delivery-date-active-background | `$nb-color-primary-light` |
| --nb-delivery-date-active-color | `$nb-color-primary` |
| --nb-delivery-date-disabled-background | `$nb-color-background` |
| --nb-delivery-date-disabled-color | `$nb-color-text-disabled` |
| --nb-delivery-date-time-pannel-width | `140px` |
| --nb-delivery-date-time-pannel-background | `$nb-color-surface-variant` |
| --nb-delivery-date-time-pannel-color | `$nb-color-text` |
| --nb-delivery-date-time-pannel-active-background | `$nb-color-surface` |
| --nb-delivery-date-time-pannel-active-color | `$nb-color-title` |
| --nb-delivery-date-time-accurate-group-color | `$nb-color-text` |

## 迁移说明 (相对 @nutui/nutui-biz 1.x)

- 基于 `@nutui/nutui-react-taro` 3.x 与 `@tarojs/components`, 仅支持 Taro。
- `duration` 单位由秒改为毫秒 (默认 `300`)。
- 不再透传任意 HTML 属性到根节点。
- 类型文件由 `delivery/type` 改为 `delivery/types`, 并随组件一起导出。
- `onSure` 新增第三个参数 `deliveryTime`; 返回的是当前配送时间 tab 的选中值 (旧版可能返回其他 tab 的选中值)。
- 未设置 `selected` 时, 子组件默认高亮第一个可选项, `onSure` 也会返回该项 (旧版高亮第一项但返回 `null`)。
- 删除了旧版用 `offsetHeight` 计算时间区域高度的逻辑, 改为 flex 布局。
