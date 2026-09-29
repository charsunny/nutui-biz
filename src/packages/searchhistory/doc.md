# SearchHistory 搜索历史

### 介绍

搜索页: 搜索栏 + 最近搜索 + 搜索发现。依赖 NutUI 组件: SearchBar。

### 安装

```tsx
import { SearchHistory } from 'nutui-biz-taro'
```

## 代码演示

### 基本用法

组件只负责展示, 最近搜索数据由业务方维护。可以用组件导出的 `addSearchKeyword` / `removeSearchHistory`
配合 `Taro.setStorageSync` 持久化。

```tsx
import { useState } from 'react'
import { getStorageSync, setStorageSync } from '@tarojs/taro'
import { SearchHistory, addSearchKeyword } from 'nutui-biz-taro'
import type { IsearchItem } from 'nutui-biz-taro'

const App = () => {
  const [recent, setRecent] = useState<IsearchItem[]>(() => getStorageSync('recentSearchData') || [])
  const save = (list: IsearchItem[]) => {
    setStorageSync('recentSearchData', list)
    setRecent(list)
  }
  return (
    <SearchHistory
      recentSearchData={recent}
      searchDiscoverData={[{ key: '小米手环', url: '' }, { key: '对讲机', url: '' }]}
      onClickSearchButton={(val) => save(addSearchKeyword(recent, val))}
      onDelete={() => save([])}
    />
  )
}
```

### 单个删除

`deleteType="single"` 时点击删除图标进入删除状态, 点击最近搜索项触发 `onDeleteSingle`。

```tsx
<SearchHistory
  deleteType="single"
  recentSearchData={recent}
  onDelete={() => save([])}
  onDeleteSingle={(item) => save(removeSearchHistory(recent, item))}
/>
```

### 自定义标题文案

```tsx
<SearchHistory recentSearchText="搜索历史" searchDiscoverText="猜你想搜" />
```

### 自定义返回和删除图标

```tsx
import { DelF, PlayDoubleBack } from '@nutui/icons-react-taro'

<SearchHistory backIcon={<PlayDoubleBack size={16} />} deleteIcon={<DelF size={16} />} />
```

### 自定义 SearchBar

```tsx
<SearchHistory
  leftInIcon={null}
  rightInIcon={null}
  rightOutIcon={<View style={{ background: '#ff0f23', padding: '6px', borderRadius: '4px', color: '#fff' }}>搜索</View>}
/>
```

### 添加搜索发现额外信息

```tsx
<SearchHistory searchDiscoverExtra={<Text style={{ fontSize: '12px', marginLeft: '10px' }}>十亿商品，搜啥都有</Text>} />
```

### 隐藏时不展示无数据文案

```tsx
<SearchHistory noDiscoverDataText="" />
```

### 刷新数据

```tsx
<SearchHistory onRefresh={() => Toast.show('toast', { content: '点击了刷新按钮' })} />
```

## API

### Props

| 字段                 | 说明                                                   | 类型          | 默认值                       |
| -------------------- | ------------------------------------------------------ | ------------- | ---------------------------- |
| recentSearchText     | 最近搜索文案                                           | string        | `最近搜索` (随语言包)        |
| searchDiscoverText   | 搜索发现文案                                           | string        | `搜索发现` (随语言包)        |
| recentSearchData     | 最近搜索数据                                           | IsearchItem[] | `[]`                         |
| searchDiscoverData   | 搜索发现数据                                           | IsearchItem[] | `[]`                         |
| keyword              | 搜索框内的搜索词                                       | string        | `''`                         |
| placeholder          | 搜索框占位文字                                         | string        | `请输入搜索关键词` (随语言包) |
| backIcon             | 搜索框左侧返回按钮，传空 (`null` / `''`) 不展示         | ReactNode     | `<ArrowLeft />`              |
| deleteIcon           | 最近搜索删除图标                                       | ReactNode     | `<Del />`                    |
| refreshIcon          | 搜索发现刷新图标，传空不展示                           | ReactNode     | `<Refresh />`                |
| searchDiscoverExtra  | 搜索发现标题后的额外信息                               | ReactNode     | -                            |
| leftInIcon           | 输入框内左侧内容，传空不展示                           | ReactNode     | `<Search />`                 |
| rightInIcon          | 输入框内右侧内容，传空不展示                           | ReactNode     | `<Photograph />`             |
| rightOutIcon         | 搜索框右侧内容 (点击触发搜索)                          | ReactNode     | `搜索` (随语言包)            |
| openEyeIcon          | 搜索发现展示中的图标                                   | ReactNode     | `<Eye />`                    |
| closeEyeIcon         | 搜索发现隐藏中的图标                                   | ReactNode     | `<Marshalling />`            |
| noDiscoverDataText   | 搜索发现隐藏时的文案，为空时在图标旁展示 `已隐藏`      | string        | `当前搜索发现已隐藏`         |
| deleteType           | 删除类型，可选 `all` `single`                          | string        | `all`                        |
| recentSearchCollapse | 保留字段，暂无效果                                     | boolean       | -                            |
| className            | 根节点类名                                             | string        | -                            |
| style                | 根节点样式                                             | CSSProperties | -                            |

图标均来自 `@nutui/icons-react-taro`。

### Events

| 字段                | 说明                                             | 回调参数                    |
| ------------------- | ------------------------------------------------ | --------------------------- |
| onClickSearchItem   | 点击搜索项 (单个删除状态下点击最近搜索项不触发)  | `searchItem: IsearchItem`   |
| onClickSearchButton | 点击搜索按钮或键盘确认搜索，之后清空输入框       | `value: string`             |
| onSearchBarChange   | 搜索框输入，可用于展示搜索建议                   | `value: string`, `event`    |
| onClickRightInIcon  | 点击输入框内右侧图标                             | -                           |
| onClickBackIcon     | 点击返回图标                                     | -                           |
| onRefresh           | 点击搜索发现刷新图标                             | -                           |
| onDelete            | 删除全部                                         | -                           |
| onDeleteSingle      | 删除单个最近搜索项                               | `item: IsearchItem`         |

### IsearchItem

| 字段 | 说明             | 类型      |
| ---- | ---------------- | --------- |
| key  | 搜索关键词       | ReactNode |
| url  | 关键词跳转链接   | string    |

### 工具函数

| 名称                | 说明                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| addSearchKeyword    | `(list, keyword, max?) => IsearchItem[]`，去空白、去重后放到最前面，空关键词不添加 |
| addSearchHistory    | `(list, item, max?) => IsearchItem[]`，按 `key` 去重后放到最前面          |
| removeSearchHistory | `(list, item) => IsearchItem[]`，删除相同 `key` 的记录                    |

## 主题定制

| 名称                                 | 默认值                   |
| ------------------------------------ | ------------------------ |
| --nb-search-history-background       | `$nb-color-surface`      |
| --nb-search-history-title-color      | `$nb-color-title`        |
| --nb-search-history-tag-color        | `$nb-color-text`         |
| --nb-search-history-tag-background   | `$nb-color-background`   |
| --nb-search-history-tag-radius       | `3px`                    |
| --nb-search-history-help-color       | `$nb-color-text-help`    |
