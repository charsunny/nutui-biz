# GoodsFilter 商品筛选

### 介绍

从右侧弹出的商品筛选面板, 包含配送地址、筛选项、价格区间、商品属性。

### 安装

```ts
import { GoodsFilter } from 'nutui-biz-taro'
```

## 代码演示

### 基础用法

```tsx
import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { GoodsFilter } from 'nutui-biz-taro'

const data = {
  filterAttrs: [
    { id: 0, name: '仅看有货' },
    { id: 1, name: '京东物流' },
  ],
  priceRanges: [
    { low: '53', high: '132', desc: '14%选择' },
    { low: '132', high: '314', desc: '45%选择' },
  ],
  goodsAttrs: [
    {
      title: '品牌',
      id: 1,
      values: [
        { id: '12690', name: '蒙牛' },
        { id: '19306', name: '伊利' },
      ],
    },
  ],
}

const App = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Cell title="点击进行商品筛选" onClick={() => setVisible(true)} />
      <GoodsFilter
        visible={visible}
        priceRanges={data.priceRanges}
        goodsAttrs={data.goodsAttrs}
        filterAttrs={data.filterAttrs}
        onClose={() => setVisible(false)}
      />
    </>
  )
}
export default App
```

### 自定义图标

```tsx
import { Heart } from '@nutui/icons-react-taro'

<GoodsFilter {...props} icon={<Heart size={12} />} />
```

### 设置默认展示行数

每类商品属性收起时展示 `maxLine` 行 (每行 3 个), 点击标题行展开 / 收起。

```tsx
<GoodsFilter {...props} maxLine={3} />
```

### 点击事件与回显

```tsx
const [selectData, setSelectData] = useState({})

<GoodsFilter
  {...props}
  visible={visible}
  selectData={selectData}
  selectedAddress={address}
  onClose={() => setVisible(false)}
  onReset={() => console.log('onReset')}
  onConfirm={(res) => {
    setSelectData({ filterAttrs: res.filterAttrs, goodsAttrs: res.goodsAttrs, price: res.price })
    setVisible(false)
  }}
  onClickAddress={() => console.log('onClickAddress')}
  onSelectedAttrs={(attr, selected, selectedAttrs) => console.log(attr, selected, selectedAttrs)}
  onSelectedPrice={(range) => console.log(range)}
  onSelectedGoodsAttr={(attrs, value) => console.log(attrs, value)}
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示 | boolean | `false` |
| confirmText | 确定按钮文案 | ReactNode | `locale.goodsfilter.confirm` (确定) |
| resetText | 重置按钮文案 | ReactNode | `locale.goodsfilter.reset` (重置) |
| priceRangeTitle | 价格区间标题 | ReactNode | `locale.goodsfilter.priceRangeTitle` (价格区间) |
| addressTitle | 配送地址标题 | ReactNode | `locale.goodsfilter.addressTitle` (配送地址) |
| selectedAddress | 选中的地址, 为空时展示 `locale.goodsfilter.noAddress` (您还没有选中的地址) | string | `''` |
| resetDisable | 重置按钮是否禁用 | boolean | `false` |
| priceRanges | 推荐价格区间 | GoodsFilterPriceRange[] | - |
| filterAttrs | 地址下方的筛选项 (多选) | GoodsFilterValue[] | - |
| goodsAttrs | 商品属性筛选项 | GoodsFilterAttrGroup[] | - |
| specStyle | 每个属性值的样式 | CSSProperties | - |
| selectedSpecShow | 是否在属性标题右侧展示已选值 | boolean | `true` |
| maxLine | 每类商品属性收起时最多展示的行数 (每行 3 个) | number | `2` |
| icon | 展开 / 收起图标, 展开时旋转 180°; 仅在属性值超过 `maxLine` 行时展示 | ReactNode | `<ArrowDown size={10} />` |
| selectData | 回显数据, 每次打开 (`visible` 变为 true) 时写入内部状态 | GoodsFilterSelectData | - |
| bottom | 自定义底部操作栏 (替换重置 / 确定按钮) | ReactNode | - |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onClose | 关闭弹层 (点击遮罩) | - |
| onReset | 点击重置 (未禁用时) | - |
| onConfirm | 点击确定; 最低价大于最高价时自动交换 | `res: GoodsFilterResult` |
| onClickAddress | 点击地址或"修改" | - |
| onSelectedAttrs | 点击筛选项 | `attr: GoodsFilterValue, selected: boolean, selectedAttrs: GoodsFilterValue[]` |
| onSelectedPrice | 点击推荐价格; 再次点击取消时回传空区间 | `range: GoodsFilterPriceRange` |
| onBeforeSelected | 选中属性值之前调用, 调用 `done()` 才会真正切换选中 | `done: () => void, selectedValue: GoodsFilterAttrSelection` |
| onSelectedGoodsAttr | 属性值选中状态切换后触发 | `attrs: GoodsFilterAttrGroup & { isExpand: boolean }, value: GoodsFilterValue` |

### 类型

```ts
interface GoodsFilterValue { id?: number | string; name?: string; [key: string]: any }
interface GoodsFilterPriceRange { low: string; high: string; desc: string; id?: number | string; extra?: any }
interface GoodsFilterAttrGroup { title: string; id: number | string; values: GoodsFilterValue[] }
interface GoodsFilterAttrSelection { id: number | string; values: (number | string)[]; isExpand?: boolean }
interface GoodsFilterSelectData {
  filterAttrs?: GoodsFilterValue[]
  goodsAttrs?: GoodsFilterAttrSelection[]
  price?: { low?: number | string; high?: number | string }
}
interface GoodsFilterResult {
  address: string
  price: { low: number | string; high: number | string }
  filterAttrs: GoodsFilterValue[]
  goodsAttrs: GoodsFilterAttrSelection[]
}
```

### 与 1.x 的差异

- `icon` 由字符串图标名 (`'arrow-down'`) 改为 `ReactNode`。
- 价格输入框改为 Taro `Input` (`type="number"`), 只保留数字。
- 手动修改价格后不再高亮推荐价格; 重置时同时清除推荐价格的高亮。
- 仅在最低价与最高价都填写时才会交换两者 (1.x 只填最低价时会被当成最高价)。
- 文案默认值改为 `locale.goodsfilter.*`, 支持国际化。

## 主题定制

| 名称 | 说明 | 默认值 |
| --- | --- | --- |
| --nb-goods-filter-background | 背景色 | `var(--nb-color-surface)` |
| --nb-goods-filter-padding | 左右内边距 | `18px` |
| --nb-goods-filter-title-color | 标题 / 选项文字色 | `var(--nb-color-title)` |
| --nb-goods-filter-text-color | 正文文字色 | `var(--nb-color-text)` |
| --nb-goods-filter-help-color | 辅助文字色 | `var(--nb-color-text-help)` |
| --nb-goods-filter-option-background | 选项背景色 | `var(--nb-color-background)` |
| --nb-goods-filter-active-color | 选中文字 / 边框色 | `var(--nb-color-primary)` |
| --nb-goods-filter-active-background | 选中背景色 | `var(--nb-color-primary-light)` |
| --nb-goods-filter-gap-background | 分隔条背景色 | `var(--nb-color-background)` |
| --nb-goods-filter-border-color | 底部操作栏上边框色 | `var(--nb-color-border)` |
| --nb-goods-filter-confirm-background | 确定按钮背景色 | `var(--nb-color-primary)` |
| --nb-goods-filter-confirm-color | 确定按钮文字色 | `var(--nb-color-primary-text)` |
