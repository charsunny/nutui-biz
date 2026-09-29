# CartBar 购物车栏

### 介绍

常见于商详页底部，包括一组图标（联系客服、店铺、购物车等）和一组按钮（加车、立即购买）。
`CartBarIcon`、`CartBarButton` 是配套子组件，放在 `CartBar` 内使用。

### 安装

```tsx
import { CartBar, CartBarIcon, CartBarButton } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

`CartBar` 默认固定在页面底部，`fixed={false}` 时按普通块级元素渲染。

```tsx
import { CartBar, CartBarIcon, CartBarButton } from 'nutui-biz-taro'
import { Cart, Store } from '@nutui/icons-react-taro'

const App = () => {
  return (
    <CartBar>
      <CartBarIcon text="店铺" icon={<Store />} />
      <CartBarIcon text="购物车" icon={<Cart />} />
      <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
      <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
    </CartBar>
  )
}
export default App
```

### 带有徽标

```tsx
<CartBar>
  <CartBarIcon text="店铺" icon={<Store />} badgeProps={{ value: 10 }} />
  <CartBarIcon text="购物车" icon={<Cart />} badgeProps={{ dot: true }} />
  <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
  <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
</CartBar>
```

### 自定义图标颜色

```tsx
<CartBar>
  <CartBarIcon text="店铺" icon={<Store color="#ff0f23" />} />
  <CartBarIcon text="购物车" icon={<Cart />} />
  <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
  <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
</CartBar>
```

### 图标无文本

```tsx
<CartBar>
  <CartBarIcon icon={<Store />} />
  <CartBarIcon icon={<Cart />} />
  <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
  <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
</CartBar>
```

### 胶囊型按钮

`hasCapsuleButtons` 时, `CartBar` 会把直接子节点里的 `CartBarButton` 拼成一组胶囊
(自动注入 `capsule` 位置), 因此按钮需要作为 `CartBar` 的直接子节点 (或在 Fragment 内);
包在自定义组件里的按钮无法识别, 这种情况可手动传 `capsule`。

```tsx
<CartBar hasCapsuleButtons>
  <CartBarIcon text="店铺" icon={<Store />} />
  <CartBarIcon text="购物车" icon={<Cart />} />
  <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
  <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
</CartBar>
```

### 顶部自定义内容

```tsx
<CartBar top={<View className="custom-top">我是自定义内容！</View>}>
  <CartBarIcon text="店铺" icon={<Store />} />
  <CartBarIcon text="购物车" icon={<Cart />} />
  <CartBarButton text="加入购物车" buttonProps={{ type: 'warning' }} />
  <CartBarButton text="立即购买" buttonProps={{ type: 'primary' }} />
</CartBar>
```

### 固定底部并占位

```tsx
<CartBar placeholder>...</CartBar>
```

占位高度通过 `SelectorQuery` 异步测量, 首帧高度为 0。

## API

### CartBar Props

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| hasCapsuleButtons | 是否把按钮拼成胶囊型 | boolean | `false` |
| safeAreaInsetBottom | 是否开启 iPhone 全面屏底部安全区适配 | boolean | `true` |
| fixed | 是否固定在页面底部 | boolean | `true` |
| placeholder | 固定在底部时，是否在原位置生成一个等高的占位元素 | boolean | `false` |
| top | 自定义顶部内容 | ReactNode | - |

### CartBarIcon Props

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon | 图标, 推荐 `@nutui/icons-react-taro` 的具名图标 | ReactNode | - |
| text | 图标文字 | ReactNode | - |
| badgeProps | 徽标 props, 传入时用 Badge 包裹图标 | `Partial<BadgeProps>` (NutUI React Taro 3.x) | - |

### CartBarIcon Events

| 字段 | 说明 | 回调参数 |
|------|------|----------|
| onClick | 点击事件 | - |

### CartBarButton Props

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| text | 按钮文字 | ReactNode | - |
| buttonProps | 按钮 props | `Partial<ButtonProps>` (NutUI React Taro 3.x) | - |
| capsule | 胶囊组内位置, `hasCapsuleButtons` 时由 CartBar 自动注入 | `'first' \| 'middle' \| 'last' \| 'only'` | - |

### CartBarButton Events

| 字段 | 说明 | 回调参数 |
|------|------|----------|
| onClick | 点击事件 | - |

## 主题定制

| 名称 | 默认值 |
|------|--------|
| --nb-cart-bar-background | `$nb-color-surface` |
| --nb-cart-bar-padding | `6px 12px` |
| --nb-cart-bar-z-index | `100` |
| --nb-cart-bar-icon-width | `44px` |
| --nb-cart-bar-icon-size | `20px` |
| --nb-cart-bar-icon-color | `$nb-color-title` |
| --nb-cart-bar-icon-text-color | `$nb-color-text` |
| --nb-cart-bar-icon-text-font-size | `10px` |
| --nb-cart-bar-button-gap | `6px` |
| --nb-cart-bar-button-capsule-radius | `999px` |

## 从 1.x 迁移

- `CartBarIcon` 的 `iconProps` (NutUI 1.x `IconProps`, 字符串图标名) 移除, 改为 `icon: ReactNode`,
  例如 `iconProps={{ name: 'cart', color: 'red' }}` → `icon={<Cart color="red" />}`。
- `badgeProps` / `buttonProps` 改为 NutUI React Taro 3.x 的 `BadgeProps` / `ButtonProps`。
- 新增 `fixed` (默认 `true`, 与旧行为一致)。
- 不再把未知属性透传到根节点。
