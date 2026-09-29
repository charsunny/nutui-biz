# HorizontalScrolling 横向滚动

### 介绍

适用于横向滚动展示内容, 如订单商品列表等, 可在一侧展示"更多"遮罩。

### 安装

```ts
import { HorizontalScrolling } from 'nutui-biz-taro'
```

## 代码演示

子节点横向排列, 需要自带宽度并且不收缩 (`flex-shrink: 0`), 可直接使用内置的 `nb-horizontalscrolling__contain-item` 类。

### 基本用法

```tsx
import { View, Image } from '@tarojs/components'
import { HorizontalScrolling } from 'nutui-biz-taro'

const imgUrl =
  'https://img13.360buyimg.com/imagetools/s140x140_jfs/t1/209493/27/20842/369749/6260d2eeE02eb253c/97386232ecf1c1ef.jpg'

const Items = () => (
  <>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <View className="nb-horizontalscrolling__contain-item" key={item}>
        <Image src={imgUrl} style={{ width: '83px', height: '83px' }} />
      </View>
    ))}
  </>
)

const App = () => (
  <HorizontalScrolling>
    <Items />
  </HorizontalScrolling>
)
export default App
```

### 遮罩层位置

```tsx
<HorizontalScrolling maskPosition="left">
  <Items />
</HorizontalScrolling>
```

### 遮罩层阴影样式 / 自定义图标

```tsx
import { More } from '@nutui/icons-react-taro'

<HorizontalScrolling
  maskPosition="left"
  maskShadowType="shadow"
  icon={<More size={26} color="#fa2c19" />}
>
  <Items />
</HorizontalScrolling>
```

### 遮罩层半透明阴影样式

`maskShadowType="transparent"` 时遮罩浮在内容之上。

```tsx
<HorizontalScrolling
  maskShadowType="transparent"
  maskWidth="50px"
  maskDistance="10px"
  maskContent={
    <View>
      <View>￥199</View>
      <Text>共3件</Text>
    </View>
  }
>
  <Items />
</HorizontalScrolling>
```

### 自定义遮罩内容

```tsx
<HorizontalScrolling
  maskShadowType="shadow"
  maskPosition="left"
  maskWidth="40px"
  maskContent={<View>查看更多</View>}
>
  <Items />
</HorizontalScrolling>
```

### 无遮罩

```tsx
<HorizontalScrolling showMask={false}>
  <Items />
</HorizontalScrolling>
```

### 事件演示

```tsx
<HorizontalScrolling
  maskShadowType="shadow"
  onClickMask={() => console.log('click mask')}
  onScrollRight={() => console.log('scroll right')}
  onScrollChange={(scrollLeft) => console.log(scrollLeft)}
>
  <Items />
</HorizontalScrolling>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showMask | 是否展示遮罩层 | boolean | `true` |
| maskPosition | 遮罩层位置, 可选值: `left`、`right` | string | `right` |
| maskShadowType | 遮罩阴影样式, 可选值: `none` 无、`triangle` 带三角、`shadow` 阴影、`transparent` 半透明 | string | `triangle` |
| maskWidth | 遮罩层宽度, 数字默认单位 px | string \| number | `100px` |
| maskDistance | 滚动内容与遮罩一侧容器边缘的距离, 数字默认单位 px | string \| number | `0` |
| maskContent | 自定义遮罩内容; 为空字符串时展示默认的 图标 + "更多" (字符串时作为文字替换"更多") | ReactNode | `''` |
| icon | 默认遮罩内容里的图标 | ReactNode | `<Category size={16} />` (`@nutui/icons-react-taro`) |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onClickMask | 点击遮罩层时触发 | - |
| onScrollRight | 滚动到最右侧时触发; 停留在最右侧不会重复触发, 离开后再次到达会再次触发 | - |
| onScrollChange | 滚动时触发 | `scrollLeft: number` |

### 与 1.x 的差异

- 移除 `iconProps` (NutUI 3 已没有字符串名的 `Icon` 组件), 改为 `icon: ReactNode`, 直接传入 `@nutui/icons-react-taro` 的图标。
- `onScrollRight` 由"在最右侧时每次滚动都触发"改为"每次到达最右侧触发一次"。
- 内容区基于 `ScrollView scrollX`, 滚动条通过 `enhanced` + `showScrollbar={false}` 隐藏。

## 主题定制

| 名称 | 说明 | 默认值 |
| --- | --- | --- |
| --nb-horizontalscrolling-mask-gap | 遮罩与内容之间的间距 | `10px` |
| --nb-horizontalscrolling-mask-color | 遮罩文字色 | `var(--nb-color-title)` |
| --nb-horizontalscrolling-mask-font-size | 遮罩文字字号 | `var(--nb-font-size-base)` |
| --nb-horizontalscrolling-shadow-color | 三角与阴影颜色 | `rgba(0, 0, 0, 0.18)` |
| --nb-horizontalscrolling-shadow-transparent | 阴影渐变起始色 | `rgba(0, 0, 0, 0)` |
| --nb-horizontalscrolling-mask-transparent-background | 半透明遮罩背景色 | `rgba(255, 255, 255, 0.7)` |
