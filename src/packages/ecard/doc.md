# Ecard 电子卡

### 介绍

虚拟电子卡面值选择：固定面值 + 其它面值输入 + 购买数量。

### 安装

```tsx
import { Ecard } from 'nutui-biz-taro'
```

## 代码演示

### 基础用法

```tsx
import { Ecard } from 'nutui-biz-taro'
import type { DataListItem } from 'nutui-biz-taro'

const dataList = [{ price: 10 }, { price: 20 }, { price: 30 }, { price: 40 }]

const App = () => {
  const onChangeInput = (val: number | '', money: number) => {
    console.log('onChangeInput', { val, money })
  }
  const onChange = (item: DataListItem, money: number) => {
    console.log('onChange', { item, money })
  }
  const onChangeStep = (num: number, price: number, money: number) => {
    console.log('onChangeStep', { num, price, money })
  }
  return (
    <Ecard
      dataList={dataList}
      onChangeInput={onChangeInput}
      onChange={onChange}
      onChangeStep={onChangeStep}
    />
  )
}
export default App
```

### 自定义价格处理函数

`handleMoney` 对「面值 × 数量」的结果做二次处理 (例如折扣), 返回值用于展示与回调里的 `money`。

```tsx
<Ecard
  chooseText="100以内打九折, 超过100打八折!"
  dataList={dataList}
  handleMoney={(money) => (money < 100 ? money * 0.9 : money * 0.8)}
/>
```

### 自定义一行展示电子卡数量

```tsx
<Ecard chooseText="请选择电子卡面值" rowNum={3} dataList={dataList6} />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| chooseText | 选择面值文案 | ReactNode | `请选择电子卡面值` |
| suffix | 货币符号 | string | `¥` |
| otherValueText | 其它面值文案 | ReactNode | `其它面值` |
| dataList | 电子卡面值列表 | `Array<DataListItem>` | `[]` |
| cardAmountMin | 其它面值最小值 | number | `1` |
| cardAmountMax | 其它面值最大值 | number | `9999` |
| inputNumberProps | 购买数量步进器 props, 与默认值合并 | `Partial<InputNumberProps>` (NutUI React Taro 3.x) | `{ min: 1, max: 9999 }` |
| placeholder | 其它面值输入框提示语 | string | `请输入1-9999整数` |
| rowNum | 每行展示卡数量 | number | `2` |
| handleMoney | 总价处理函数 | `(money: number) => any` | 原样返回 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| onChange | 选中某固定面值卡时触发 | item: 当前卡对应的 DataListItem, 例如 `{ price: 100 }`; money: 当前购卡总价值 |
| onChangeInput | 其它面值输入时触发 | val: 规范化后的自定义面值 (清空时为 `''`); money: 当前购卡总价值 |
| onChangeStep | 更改数量时触发 | num: 当前购买数量; price: 当前面值 (固定面值或自定义面值); money: 当前购卡总价值 |

### DataListItem 数据结构

| 键名 | 说明 | 类型 |
|------|------|------|
| price | 每张电子卡价格 | number |

## 主题定制

| 名称 | 默认值 |
|------|--------|
| --nb-ecard-title-color | `$nb-color-title` |
| --nb-ecard-title-font-size | `15px` |
| --nb-ecard-item-height | `46px` |
| --nb-ecard-item-background | `$nb-color-background` |
| --nb-ecard-item-color | `$nb-color-title` |
| --nb-ecard-item-radius | `4px` |
| --nb-ecard-item-active-background | `$nb-color-surface` |
| --nb-ecard-item-active-color | `$nb-color-primary` |
| --nb-ecard-item-active-border-color | `$nb-color-primary` |
| --nb-ecard-money-color | `$nb-color-price` |
| --nb-ecard-money-font-size | `20px` |

## 从 1.x 迁移

- `inputNumberProps` 改为 NutUI React Taro 3.x 的 `InputNumberProps` (`modelValue` → `value`,
  `onChangeFuc` → `onChange`, `onAdd`/`onReduce` → `onPlus`/`onMinus`)。`inputNumberProps.onChange` 仍会被调用。
- 购买数量的初始值取 `inputNumberProps.value` / `defaultValue` / `min` (旧版误用了 `cardAmountMin`)。
- 其它面值输入框改为 Taro `Input`; 清空输入不再被强制改回最小值, `onChangeInput` 的 `val` 此时为 `''`。
- 内部 class 按 BEM 调整 (`__list__item` → `__item`, `.active` → `--active` 等)。
- 不再把未知属性透传到根节点。
