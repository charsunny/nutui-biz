# Coupon 优惠券

### 介绍

优惠券展示与领取, 支持大卡片 (右侧按钮) 与小卡片 (右侧竖排文字按钮) 两种尺寸。

### 安装

```tsx
import { Coupon } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

背景图、宽高通过 `couponStyle` 设置; 主体区域 (价格 + 文案) 的宽度、颜色通过 `couponMainStyle` 设置。

```tsx
import { useState } from 'react'
import { Image } from '@tarojs/components'
import { Coupon } from 'nutui-biz-taro'

const App = () => {
  const [received, setReceived] = useState(false)
  return (
    <Coupon
      pricePosition="back"
      couponStyle={{
        width: '100%',
        backgroundImage: 'url(https://storage.360buyimg.com/jdcdkh/open/1.0.0/assets/bg-coupon-red.f6ae2e19.png)',
      }}
      couponMainStyle={{ width: '69%', color: '#fff' }}
      couponData={{
        price: '9.212',
        currency: '¥',
        mainTitle: '满100元可用',
        subTitle: '仅可购买满折券测试',
        label: '内购专享',
        timeRange: '2022.03.01-2022.04.01',
      }}
      btnText={received ? '已领取' : '立即领取'}
      isReceived={received}
      usedIcon={
        <Image style={{ width: '45px', height: '42px' }} src="https://storage.360buyimg.com/jdcdkh/open/1.0.0/assets/use-mask.60dc7c10.png" />
      }
      buttonProps={{ type: 'primary', size: 'small', fill: 'outline' }}
      onBtnClick={() => setReceived(true)}
    />
  )
}
```

### 小卡片类型

```tsx
<ScrollView scrollX>
  <View style={{ display: 'flex', flexWrap: 'wrap', width: '700px' }}>
    {list.map((item) => (
      <Coupon
        key={item}
        type="small"
        pricePosition="front"
        couponStyle={{ width: '127px', marginRight: '10px', marginBottom: '10px', backgroundImage: 'url(https://static.360buyimg.com/jdcdkh/open/1.0.0/assets/bg-coupon.6df5b4ed.png)' }}
        couponMainStyle={{ width: '80%' }}
        couponData={{ price: 9, currency: '¥', mainTitle: '满100元可用', subTitle: '仅可购买满折券测试', label: '618', item }}
        isReceived={received.includes(item)}
        btnText={received.includes(item) ? '已领取' : '立即领取'}
        onBtnClick={(data) => setReceived([...received, data.item])}
      />
    ))}
  </View>
</ScrollView>
```

## API

### Props

| 字段            | 说明                                           | 类型                 | 默认值     |
| --------------- | ---------------------------------------------- | -------------------- | ---------- |
| type            | 优惠券的类型，可选 `large` `small`             | string               | `large`    |
| couponStyle     | 每张优惠券的样式 (背景图、宽高等)              | CSSProperties        | -          |
| couponMainStyle | 优惠券主体的样式                               | CSSProperties        | -          |
| pricePosition   | 价格和单位的前后位置，`front` 价格在前，`back` 单位在前 | string      | `back`     |
| couponData      | 优惠券内容                                     | ICouponType          | -          |
| btnText         | 按钮文案                                       | string               | `立即领取` (随语言包) |
| isReceived      | 是否已领取 (large 类型会禁用按钮并展示 `usedIcon`) | boolean          | `false`    |
| buttonProps     | large 类型按钮的 props，来自 NutUI React Taro 3.x 的 Button | Partial\<ButtonProps\> | - |
| usedIcon        | 已领取时右上角的标记                           | ReactNode            | -          |
| className       | 根节点类名                                     | string               | -          |
| style           | 根节点样式                                     | CSSProperties        | -          |

### ICouponType

| 字段      | 说明                   | 类型             |
| --------- | ---------------------- | ---------------- |
| price     | 价格或折扣，最多保留两位小数、最多展示 5 个字符 | string \| number |
| currency  | 货币符号 / 单位        | string           |
| mainTitle | 主标题                 | string           |
| subTitle  | 副标题                 | string           |
| timeRange | 使用时间范围           | string           |
| label     | 左上角的标签内容       | ReactNode        |

### Events

| 字段       | 说明           | 回调参数     |
| ---------- | -------------- | ------------ |
| onBtnClick | 点击领取按钮   | `couponData` |

### 工具函数

| 名称              | 说明                                 |
| ----------------- | ------------------------------------ |
| formatCouponPrice | 组件内部使用的金额格式化，`(price: string \| number) => string` |

## 主题定制

| 名称                          | 默认值               |
| ----------------------------- | -------------------- |
| --nb-coupon-color             | `$nb-color-primary`  |
| --nb-coupon-label-color       | `$nb-color-primary`  |
| --nb-coupon-label-background  | `$nb-color-surface`  |
| --nb-coupon-small-height      | `81px`               |
