# SettleBar 结算栏

### 介绍

常见于购物车页底部，包括全选、合计与「去结算」按钮。也适用于结算页底部的提交订单栏。

### 安装

```tsx
import { SettleBar } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

默认固定在页面底部；`fixed={false}` 时按普通块级元素渲染。

```tsx
import { useState } from 'react'
import { SettleBar } from 'nutui-biz-taro'

const App = () => {
  const [checkedAll, setCheckedAll] = useState(false)
  return (
    <SettleBar
      total={checkedAll ? 100 : 0}
      settleCount={checkedAll ? 2 : 0}
      isCheckedAll={checkedAll}
      onSelectAll={(checked) => setCheckedAll(checked)}
      onClickButton={() => console.log('去结算')}
    />
  )
}
export default App
```

### 对齐方式

```tsx
<SettleBar total={100} totalAlign="left" />
```

### 禁用状态

```tsx
<SettleBar total={100} disabled />
```

### 加载状态

```tsx
<SettleBar total={100} loading />
```

### 提交订单

`customSelectAll` 传空字符串 / `null` / `false` 时隐藏全选。

```tsx
<SettleBar
  total={100}
  customSelectAll=""
  noCount
  totalText="总计"
  settleButtonText="提交订单"
/>
```

### 去结算数量

```tsx
<SettleBar total={100} settleCount="100" />
```

### 自定义合计额外区域内容

```tsx
<SettleBar total={100} customTotalExtra={<Text>已减 ¥30.00</Text>} />
```

### 带有警告信息

```tsx
<SettleBar total={100} customWarning={<View className="warning">此商品无货！</View>} />
```

### 固定底部并占位

```tsx
<SettleBar total={100} placeholder />
```

占位高度通过 `SelectorQuery` 异步测量, 首帧高度为 0。

## API

### Props

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| total | 合计价格 | number \| string | `0` |
| totalText | 合计文案 | string | `合计` |
| totalAlign | 合计区域对齐方式 | `'left' \| 'right'` | `right` |
| settleCount | 结算数量 | ReactNode | `0` |
| settleButtonText | 结算按钮文案 | string | `去结算` |
| disabled | 结算按钮是否置灰 | boolean | `false` |
| loading | 结算按钮是否加载中 | boolean | `false` |
| showZero | settleCount 为 0 时，是否还展示结算按钮中的数量 | boolean | `true` |
| noCount | 是否不展示结算按钮中的数量 | boolean | `false` |
| safeAreaInsetBottom | 是否开启 iPhone 全面屏底部安全区适配 | boolean | `true` |
| fixed | 是否固定在页面底部 | boolean | `true` |
| placeholder | 固定在底部时，是否在原位置生成一个等高的占位元素 | boolean | `false` |
| customTotal | 合计区域自定义 | ReactNode | - |
| customWarning | 上方提示内容自定义 | ReactNode | - |
| customSelectAll | 全选内容自定义, 传假值 (非 undefined) 时隐藏全选 | ReactNode | - |
| customTotalPrice | 合计价格内容自定义 | ReactNode | - |
| customTotalExtra | 合计额外区域自定义 | ReactNode | - |
| customButton | 按钮内容自定义 | ReactNode | - |
| isCheckedAll | 全选按钮是否选中 | boolean | `false` |

### Events

| 字段 | 说明 | 回调参数 |
|------|------|----------|
| onSelectAll | 全选按钮点击事件 | checked: boolean |
| onClickButton | 按钮点击事件 (禁用 / 加载中时不触发) | - |

## 主题定制

| 名称 | 默认值 |
|------|--------|
| --nb-settle-bar-background | `$nb-color-surface` |
| --nb-settle-bar-z-index | `100` |
| --nb-settle-bar-warning-height | `38px` |
| --nb-settle-bar-warning-background | `$nb-color-warning` |
| --nb-settle-bar-warning-opacity | `0.1` |
| --nb-settle-bar-total-color | `$nb-color-title` |
| --nb-settle-bar-total-font-size | `14px` |
| --nb-settle-bar-price-color | `$nb-color-price` |
| --nb-settle-bar-button-width | `113px` |
| --nb-settle-bar-button-height | `38px` |
| --nb-settle-bar-button-background | `$nb-color-primary-gradient` |
| --nb-settle-bar-button-color | `$nb-color-primary-text` |
| --nb-settle-bar-button-font-size | `14px` |
| --nb-settle-bar-button-disabled-opacity | `0.3` |

## 从 1.x 迁移

- 新增 `fixed` (默认 `true`, 与旧行为一致)。
- 全选使用 NutUI React Taro 3.x 的 `Checkbox`。
- 结算按钮 class 由 `nb-settle-bar__main-buy` / `.disabled` 改为 `nb-settle-bar__button` / `nb-settle-bar__button--disabled`;
  其他内部 class 同样按 BEM 调整 (`__main-select-all` → `__select-all`, `__main-total` → `__total`)。
- 不再把未知属性透传到根节点。
