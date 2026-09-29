# ProductFeed 商品 Feed 流

### 介绍

用于展示商品列表 (单列 / 双列瀑布流), 内置上拉加载与下拉刷新。

### 安装

```ts
import { ProductFeed } from 'nutui-biz-taro'
```

开启上拉加载 (`openInfiniteloading`, 默认开启) 时, 组件内部是 NutUI 3 的 `InfiniteLoading` (一个高度 100% 的 `ScrollView`),
**需要给组件或其父节点一个确定的高度**; 滚动发生在组件内部, 而不是页面。

## 代码演示

### 双列

```tsx
import { useState } from 'react'
import { View } from '@tarojs/components'
import { Price } from '@nutui/nutui-react-taro'
import { ProductFeed } from 'nutui-biz-taro'

const TOTAL = 18
const all = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  imgUrl:
    'https://img13.360buyimg.com/imagetools/jfs/t1/190855/7/12881/42147/60eb0cabE0c3b7234/d523d551413dc853.png',
  name: '我是标题我是标题我是标题',
  price: '388',
}))

const App = () => {
  const [list, setList] = useState(all.slice(0, 6))

  const loadMore = async () => {
    await new Promise((r) => setTimeout(r, 500))
    setList((prev) => all.slice(0, prev.length + 6))
  }

  return (
    <View style={{ height: '100vh' }}>
      <ProductFeed
        data={list}
        infiniteloadingProps={{ hasMore: list.length < TOTAL, onLoadMore: loadMore }}
        customProduct={(item) => (
          <>
            <View>{item.name}</View>
            <Price price={item.price} />
          </>
        )}
        col={2}
        imgUrl="imgUrl"
        imgWidth="144"
        imgHeight="144"
        onClick={(item, index) => console.log('click', item, index)}
        onImageClick={(item, index) => console.log('click image', item, index)}
      />
    </View>
  )
}
export default App
```

### 单列

```tsx
<ProductFeed
  data={list}
  col={1}
  imgUrl="imgUrl"
  imgWidth="100"
  imgHeight="100"
  infiniteloadingProps={{ hasMore, onLoadMore: loadMore }}
  customProduct={customProduct}
/>
```

### 下拉刷新

```tsx
<ProductFeed
  data={list}
  infiniteloadingProps={{
    hasMore,
    pullRefresh: true,
    onLoadMore: loadMore,
    onRefresh: async () => {
      await fetchFirstPage()
    },
  }}
  customProduct={customProduct}
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 商品数据 | any[] | `[]` |
| itemKey | 商品唯一 key 的字段名 (缺失时回落到序号) | string | `id` |
| customProduct | 商品图片下方区域内容 | (item) => ReactNode | - |
| openInfiniteloading | 是否开启上拉加载 | boolean | `true` |
| infiniteloadingProps | 透传给 NutUI 3 [InfiniteLoading](https://nutui.jd.com/taro/react/3x/#/zh-CN/component/infiniteloading) 的 props | Partial\<InfiniteLoadingProps\> | - |
| col | 每行商品数量, 可选值: `1`、`2` | number \| string | `2` |
| padding | 商品内边距, 数字默认单位 px | number \| string | `10px` |
| borderRadius | 商品圆角, 数字默认单位 px | number \| string | `8px` |
| imgUrl | 商品图片地址所在的**字段名** | string | `''` |
| imgWidth | 商品图片宽度, 数字默认单位 px | number \| string | `150px` |
| imgHeight | 商品图片高度, 数字默认单位 px | number \| string | `150px` |
| imgTag | 商品图片左上角标签 | ReactNode | - |
| isImageLazy | 商品图片是否懒加载 | boolean | `true` |
| loadingImg | 图片加载中的占位图 | string | 京东默认占位图 |
| errorImg | 图片加载失败的占位图 | string | 京东默认占位图 |
| initProductNum | 已废弃, 不再生效 (见下方差异说明) | number | - |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

### infiniteloadingProps 常用字段 (NutUI 3)

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| hasMore | 是否还有更多数据 | boolean |
| threshold | 距底部多远触发加载 (px) | number |
| onLoadMore | 上拉加载回调, 返回 Promise, resolve 后结束加载状态 | () => Promise\<void\> |
| pullRefresh | 是否开启下拉刷新 | boolean |
| onRefresh | 下拉刷新回调, 返回 Promise | () => Promise\<void\> |
| onScroll | 滚动回调 | (scrollTop: number) => void |
| loadingText / loadMoreText / pullingText | 各状态文案 | ReactNode |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onClick | 点击商品时触发 | `item, index` |
| onImageClick | 点击商品图片时触发 (不会再触发 onClick) | `item, index` |

### 与 1.x 的差异

- `infiniteloadingProps` 改为 NutUI 3 的 `InfiniteLoadingProps`: `onLoadMore(done)` / `onRefresh(done)` 回调改为返回 Promise;
  `isOpenRefresh` → `pullRefresh`; `containerId` / `useWindow` 不再需要 (滚动容器就是组件自身, 需给定高度)。
- `initProductNum` 废弃: 1.x 中它表示"每次 data 变化时最多追加展示的条数", 双列时会导致部分数据不展示; 现在 `data` 全部展示。
- `padding` / `borderRadius` / `isImageLazy` / `loadingImg` / `errorImg` 在 1.x 中未生效, 现已生效。

## 主题定制

| 名称 | 说明 | 默认值 |
| --- | --- | --- |
| --nb-productfeed-gap | 双列时每列左右内边距 | `4px` |
| --nb-productfeed-item-background | 商品背景色 | `var(--nb-color-surface)` |
| --nb-productfeed-item-margin | 商品之间的间距 | `8px` |
