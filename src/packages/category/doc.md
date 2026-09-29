# Category 商品分类

### 介绍

用于展示商品分类: 左侧为一级分类导航, 右侧为当前一级分类下的二级分类分区与三级分类列表。

### 安装

```ts
import { Category } from 'nutui-biz-taro'
```

组件内部左右两侧都是 `ScrollView`, **需要给组件 (或其父节点) 一个确定的高度**。

## 代码演示

### 经典用法

```tsx
import { View } from '@tarojs/components'
import { Category } from 'nutui-biz-taro'
import type { CategoryData, CategoryPaneItem } from 'nutui-biz-taro'

const App = () => {
  const category: CategoryData[] = [] // 分类数据, 结构见下方 CategoryData

  return (
    <View style={{ height: '100vh' }}>
      <Category
        category={category}
        isLazy={false}
        showPullUp
        onChange={(item: CategoryData) => console.log('一级分类', item)}
        onPanelThirdClick={(sku: CategoryPaneItem) => console.log('三级分类', sku)}
      />
    </View>
  )
}
export default App
```

### 隐藏图片

通过 `showSkuImg={false}` 不展示三级分类图片, 以文字标签形式展示。

```tsx
<Category category={category} showSkuImg={false} />
```

### 横向快捷导航

通过设置 `showSecondLevelQuickNav`, 在右侧顶部展示横向二级分类导航: 点击可快速定位到对应分区;
滚动右侧内容时, 快捷导航会高亮当前所在分区并自动居中。

```tsx
<Category
  category={category}
  showSecondLevelQuickNav
  onPanelNavClick={(index) => console.log('二级分类', index)}
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| category | 分类数据 | CategoryData[] | `[]` |
| showSecondLevelQuickNav | 是否展示二级分类横向快捷导航 | boolean | `false` |
| isLeftAutoSlide | 点击左侧一级分类后, 选中项是否自动滚动到居中 | boolean | `true` |
| showSkuImg | 三级分类是否展示图片 | boolean | `true` |
| isLazy | 三级分类图片是否懒加载 | boolean | `true` |
| loadingImg | 图片加载中的占位图 | string | 京东默认占位图 |
| errorImg | 图片加载失败的占位图 | string | 京东默认占位图 |
| showPullUp | 是否在右侧底部展示"向上拉继续浏览" | boolean | `false` |
| pullUpText | 自定义"向上拉继续浏览"文案 | ReactNode | `locale.category.pullUpText` |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onChange | 点击左侧一级分类时触发 (点击当前已选中项不触发) | `category: CategoryData` |
| onPanelNavClick | 点击右侧二级分类快捷导航时触发 | `index: number` |
| onPanelThirdClick | 点击右侧三级分类时触发 | `sku: CategoryPaneItem` |

### CategoryData (一级分类)

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| catId | 一级分类 id | string \| number |
| catName | 一级分类名称 | string |
| children | 二级分类 | CategoryPaneData[] |

### CategoryPaneData (二级分类)

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| catId | 二级分类 id | string \| number |
| catName | 二级分类名称 | string |
| children | 三级分类 | CategoryPaneItem[] |

### CategoryPaneItem (三级分类)

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| catId | 三级分类 id | string \| number |
| catName | 三级分类名称 | string |
| backImg | 三级分类图片 | string |

### 行为说明

- 切换一级分类时, 右侧内容回到顶部, 快捷导航回到第一项。
- 快捷导航的高亮依赖右侧 `ScrollView` 的 `onScroll` 与 `SelectorQuery` 测量分区位置; 分区高度在数据变化时重新测量。

## 主题定制

| 名称 | 说明 | 默认值 |
| --- | --- | --- |
| --nb-category-background | 背景色 | `var(--nb-color-surface)` |
| --nb-category-nav-width | 左侧导航宽度 | `100px` |
| --nb-category-nav-item-height | 左侧导航项高度 | `50px` |
| --nb-category-nav-background | 左侧导航背景色 | `var(--nb-color-surface-variant)` |
| --nb-category-nav-color | 左侧导航文字色 | `var(--nb-color-title)` |
| --nb-category-nav-font-size | 左侧导航字号 | `13px` |
| --nb-category-nav-active-background | 左侧选中项背景色 | `var(--nb-color-surface)` |
| --nb-category-nav-active-bar-color | 左侧选中项竖条颜色 | `var(--nb-color-primary)` |
| --nb-category-pane-title-color | 二级分类标题颜色 | `var(--nb-color-title)` |
| --nb-category-pane-text-color | 三级分类文字颜色 | `var(--nb-color-text)` |
| --nb-category-pane-border-color | 无图模式标签边框色 | `var(--nb-color-border)` |
| --nb-category-pane-img-size | 三级分类图片尺寸 | `75px` |
| --nb-category-quick-background | 快捷导航背景色 | `var(--nb-color-surface)` |
| --nb-category-quick-item-background | 快捷导航项背景色 | `var(--nb-color-background)` |
| --nb-category-quick-item-color | 快捷导航项文字色 | `var(--nb-color-text)` |
| --nb-category-quick-active-background | 快捷导航选中背景色 | `var(--nb-color-primary-light)` |
| --nb-category-quick-active-color | 快捷导航选中文字/边框色 | `var(--nb-color-primary)` |
| --nb-category-pull-up-color | "向上拉继续浏览"文字色 | `var(--nb-color-text-help)` |
| --nb-category-pull-up-icon-color | "向上拉继续浏览"图标色 | `var(--nb-color-primary)` |
