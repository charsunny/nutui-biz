# QuickEnter 快捷入口

### 介绍

快捷入口, 又称为金刚区, 是页面头部的核心功能区域, 表现形式为多行排列的宫格图标。

### 安装

```ts
import { QuickEnter } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

```tsx
import { QuickEnter } from 'nutui-biz-taro'
import type { QuickEnterData } from 'nutui-biz-taro'

const data: QuickEnterData[] = [
  {
    displayName: '手机通讯',
    imageUrl:
      'https://img12.360buyimg.com/imagetools/s100x100_jfs/t1/135346/37/5276/9667/5f1a50a3E51cf1d21/2831b07712127aaa.png',
  },
  // ...
]

const App = () => <QuickEnter data={data} onClickItem={(item) => console.log(item)} />
export default App
```

### 轮播展示

当数据超过一屏 (`columns * rows`) 时, 默认以轮播 (Swiper) 方式翻页展示。

```tsx
<QuickEnter data={data} indicatorVisible />
```

### 单行

```tsx
<QuickEnter data={data} rows={1} indicatorVisible />
```

### 滑动展示

`slideMode="slide"` 时多屏横向滑动展示, 底部带自定义滚动条。

```tsx
<QuickEnter slideMode="slide" data={data} rows={2} />
```

### 自定义列数、图标大小与指示器颜色

```tsx
<QuickEnter
  data={data}
  columns={4}
  rows={1}
  iconSize={[40, 40]}
  indicatorVisible
  indicatorBgColor="#ddd"
  indicatorActiveColor="#0073ff"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 展示数据 | QuickEnterData[] | `[]` |
| columns | 每行展示的数量 | number \| string | `5` |
| rows | 每屏展示的行数 | number \| string | `2` |
| slideMode | 多屏展示方式, 可选值: `swiper` (轮播翻页)、`slide` (横向滑动) | string | `swiper` |
| iconSize | 图标宽高, 单位 px | Array<number \| string> | `[30, 30]` |
| indicatorVisible | `swiper` 模式是否展示指示器 (仅多屏时展示) | boolean | `false` |
| indicatorBgColor | 指示器背景色; `slide` 模式为滚动条轨道色 | string | 跟随主题 (`--nb-quick-enter-indicator-color`) |
| indicatorActiveColor | 指示器选中色; `slide` 模式为滚动条滑块色 | string | 跟随主题 (`--nb-quick-enter-indicator-active-color`) |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

### QuickEnterData

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| displayName | 入口名称 | string |
| imageUrl | 入口图标: 图片链接, 或自定义节点 | ReactNode |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onClickItem | 点击入口时触发 | `item: QuickEnterData` |

### 行为说明

- `swiper` 模式基于 NutUI `Swiper`, 小程序的 swiper 需要显式高度: 组件先按 `rows` 与 `iconSize` 估算高度, 渲染后再按首屏实际高度校正。
- `slide` 模式基于 `ScrollView scrollX`, 滚动条仅在多于一屏时展示。

## 主题定制

| 名称 | 说明 | 默认值 |
| --- | --- | --- |
| --nb-quick-enter-background | 背景色 | `transparent` |
| --nb-quick-enter-desc-color | 名称文字色 | `var(--nb-color-text)` |
| --nb-quick-enter-desc-font-size | 名称字号 | `var(--nb-font-size-s)` |
| --nb-quick-enter-indicator-color | 指示器 / 滚动条轨道色 | `var(--nb-color-border)` |
| --nb-quick-enter-indicator-active-color | 指示器选中 / 滚动条滑块色 | `var(--nb-color-primary)` |
