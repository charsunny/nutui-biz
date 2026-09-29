# Sku 商品规格选择

### 介绍

常见于商详（单品）页，在底部弹层中选择商品规格与购买数量。

### 安装

```tsx
import { Sku } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

组件本身不维护规格选中状态: 点击规格值时触发 `onSelectSku`, 由业务方更新 `sku` 数据。
可以直接用导出的纯函数 `selectSkuItem` 完成「同类目单选」。

```tsx
import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { Sku, selectSkuItem } from 'nutui-biz-taro'
import type { SkuGoods, SkuSelectInfo, SkuSpec } from 'nutui-biz-taro'

const initialSku: SkuSpec[] = [
  {
    id: 1,
    name: '颜色',
    list: [
      { id: 100016015112, name: '亮黑色', active: true },
      { id: 100016015142, name: '釉白色' },
    ],
  },
  {
    id: 2,
    name: '版本',
    list: [
      { id: 100016015102, name: '8GB+128GB', active: true },
      { id: 100016015122, name: '8GB+256GB', disable: true },
    ],
  },
]

const App = () => {
  const [visible, setVisible] = useState(false)
  const [sku, setSku] = useState(initialSku)
  const [goods, setGoods] = useState<SkuGoods>({
    skuId: '100016015112',
    price: '4599.00',
    imagePath: 'https://img14.360buyimg.com/n4/jfs/t1/216079/14/3895/201095/618a5c0cEe0b9e2ba/cf5b98fb6128a09e.jpg',
  })

  const onSelectSku = ({ sku: item, parentIndex }: SkuSelectInfo) => {
    setSku((prev) => selectSkuItem(prev, parentIndex, item.id))
    setGoods((prev) => ({ ...prev, skuId: String(item.id) }))
  }

  return (
    <>
      <Cell title="基本用法" clickable onClick={() => setVisible(true)} />
      <Sku
        visible={visible}
        sku={sku}
        goods={goods}
        onSelectSku={onSelectSku}
        onClickBtnOperate={({ type, value }) => console.log(type, value)}
        onClose={() => setVisible(false)}
      />
    </>
  )
}
export default App
```

### 不可售

```tsx
<Sku
  visible={visible}
  sku={sku}
  goods={goods}
  btnExtraText="抱歉，此商品在所选区域暂无存货"
  operateBtn={
    <View className="operate-box">
      <Button type="warning">查看相似商品</Button>
      <Button type="info">到货通知</Button>
    </View>
  }
  onSelectSku={onSelectSku}
  onClose={() => setVisible(false)}
/>
```

### 自定义计步器

```tsx
<Sku
  visible={visible}
  sku={sku}
  goods={goods}
  stepperMax={7}
  stepperMin={2}
  stepperExtraText={() => <Text>2 件起售</Text>}
  btnOptions={['buy', 'cart']}
  onChangeStepper={(count) => console.log('购买数量', count)}
  onOverLimit={() => console.log('已到极限值')}
  onSelectSku={onSelectSku}
  onClickBtnOperate={({ type, value }) => console.log(type, value)}
  onClose={() => setVisible(false)}
/>
```

### 自定义内容

```tsx
<Sku
  visible={visible}
  sku={sku}
  goods={goods}
  btnOptions={['buy', 'cart']}
  skuHeaderPrice={<Price price={goods.price} symbol="¥" thousands={false} size="large" />}
  skuHeaderExtra={<Text>重量：0.1kg 编号：{goods.skuId}</Text>}
  skuSelectTop={<Cell title="送至" extra="北京市石景山区城区" />}
  operateBtn={
    <View className="operate-box">
      <Button type="warning">加入购物车</Button>
      <Button type="primary">立即购买</Button>
    </View>
  }
  onSelectSku={onSelectSku}
  onClose={() => setVisible(false)}
/>
```

### 规格联动 (按可售组合置灰)

`resolveSkuAvailability(sku, combos)` 根据「可售组合」重新计算每个规格值的 `disable`:
某个规格值可选, 当且仅当存在一个组合同时包含它和其它类目当前选中的规格值。
因此变为不可选的选中项会被取消选中。

```tsx
import { resolveSkuAvailability, selectSkuItem } from 'nutui-biz-taro'

// 每个组合是一个可售 SKU 包含的规格值 id (与类目顺序无关)
const combos = [
  [100016015112, 100016015102],
  [100016015142, 100016015122],
]

const [sku, setSku] = useState(() => resolveSkuAvailability(initialSku, combos))

const onSelectSku = ({ sku: item, parentIndex }: SkuSelectInfo) => {
  setSku((prev) => resolveSkuAvailability(selectSkuItem(prev, parentIndex, item.id), combos))
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| visible | 是否显示商品规格弹层 | boolean | `false` |
| sku | 商品规格数据 | `SkuSpec[]` | `[]` |
| goods | 商品信息 | `Partial<SkuGoods>` | - |
| stepperMax | 购买数量最大值 | string \| number | `99999` |
| stepperMin | 购买数量最小值 (也是初始数量) | string \| number | `1` |
| btnOptions | 底部按钮, 可选 `confirm` / `buy` / `cart`, 分别对应确定、立即购买、加入购物车 | `string[]` | `['confirm']` |
| btnExtraText | 按钮上方的提示文案 | string | - |
| stepperTitle | 数量选择区左侧文案 | string | `购买数量` |
| stepperExtraText | 数量选择区标题与步进器之间的内容 | `(() => ReactNode) \| boolean` | `false` |
| buyText | 立即购买按钮文案 | string | `立即购买` |
| addCartText | 加入购物车按钮文案 | string | `加入购物车` |
| confirmText | 确定按钮文案 | string | `确定` |
| skuHeader | 替换整个商品信息区 (图片、价格、编号) | ReactNode | - |
| skuHeaderPrice | 商品信息区的价格部分 | ReactNode | - |
| skuHeaderExtra | 商品信息区的编号部分 | ReactNode | - |
| skuSelectTop | 规格区上方内容 | ReactNode | - |
| skuSelect | 替换规格区 | ReactNode | - |
| skuStepper | 替换数量选择区 | ReactNode | - |
| skuStepperBottom | 数量选择区下方内容 | ReactNode | - |
| skuOperate | 底部按钮区上方的自定义内容 | ReactNode | - |
| operateBtn | 替换底部按钮 | ReactNode | - |
| popupProps | 透传给弹层的 props | `Partial<PopupProps>` (NutUI React Taro 3.x) | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| onSelectSku | 点击可选的规格值时触发 | `SkuSelectInfo`: `{ sku, skuIndex, parentSku, parentIndex }` |
| onAdd | 点击数量「+」时触发 | value: 点击后的数量 |
| onReduce | 点击数量「-」时触发 | value: 点击后的数量 |
| onOverLimit | 点击不可用的「+」/「-」时触发 | - |
| onChangeStepper | 购买数量变化时触发 | value: number |
| onClickBtnOperate | 点击底部按钮时触发 | `{ type: 'confirm' \| 'buy' \| 'cart', value: 购买数量 }` |
| onClickCloseIcon | 点击关闭图标时触发 | - |
| onClickOverlay | 点击遮罩时触发 | - |
| onClose | 弹层关闭时触发 | - |

### 数据结构

```ts
interface SkuSpec {
  id: number | string // 类目 id
  name: string // 类目名, 如「颜色」
  list: SkuItem[]
}

interface SkuItem {
  id: number | string // 规格值 id
  name: string // 规格值名称
  active?: boolean // 是否选中
  disable?: boolean // 是否置灰
}

interface SkuGoods {
  price: number | string
  imagePath: string
  skuId: string | number
}
```

### 工具函数

纯函数, 不修改入参, 返回新数组。

| 函数 | 说明 |
|------|------|
| `selectSkuItem(sku, parentIndex, itemId)` | 在第 parentIndex 个类目中单选 itemId; 规格值置灰或不存在时原样返回 |
| `getSelectedSkuItems(sku)` | 每个类目当前选中的规格值 (未选为 `undefined`) |
| `isSkuComplete(sku)` | 是否每个类目都已选中 |
| `resolveSkuAvailability(sku, combos)` | 按可售组合重新计算 `disable`, 并取消不可选的选中项 |

## 主题定制

| 名称 | 默认值 |
|------|--------|
| --nb-sku-background | `$nb-color-surface` |
| --nb-sku-padding | `18px` |
| --nb-sku-content-max-height | `50vh` |
| --nb-sku-image-size | `100px` |
| --nb-sku-image-radius | `8px` |
| --nb-sku-extra-color | `$nb-color-text-help` |
| --nb-sku-title-color | `$nb-color-title` |
| --nb-sku-title-font-size | `13px` |
| --nb-sku-item-height | `30px` |
| --nb-sku-item-font-size | `12px` |
| --nb-sku-item-color | `$nb-color-title` |
| --nb-sku-item-background | `$nb-color-background` |
| --nb-sku-item-active-color | `$nb-color-primary` |
| --nb-sku-item-active-background | `$nb-color-primary-light` |
| --nb-sku-item-active-border-color | `$nb-color-primary` |
| --nb-sku-item-disable-color | `$nb-color-text-disabled` |
| --nb-sku-desc-color | `$nb-color-warning` |
| --nb-sku-desc-background | `$nb-color-surface-variant` |
| --nb-sku-btn-height | `40px` |
| --nb-sku-btn-color | `$nb-color-primary-text` |
| --nb-sku-btn-font-size | `15px` |
| --nb-sku-btn-background | `$nb-color-primary-gradient` |
| --nb-sku-btn-cart-background | `$nb-color-warning` |

## 从 1.x 迁移

- 不再把 Sku 的全部 props 透传给 Popup; 需要的弹层配置改用 `popupProps` (NutUI React Taro 3.x `PopupProps`)。
  `className` / `style` 只作用于弹层内的 `.nb-sku` 节点。
- `onClickBtnOperate` 回调参数改为 `{ type, value }` (与旧文档一致; 旧实现实际只传了数量字符串)。
- `onAdd` / `onReduce` 现在会真正触发 (旧实现未调用), 参数为点击后的数量。
- 修正了旧实现在弹层未打开时首帧就触发 `onClose` 的问题。
- 内部 class 从 `nut-sku-*` 改为 BEM 的 `nb-sku__*` (例如 `nut-sku-select-item-skus-sku.active` →
  `nb-sku__select-sku--active`)。
- 价格使用 NutUI 3.x `Price` (`needSymbol` 已移除, 使用 `symbol`)。
