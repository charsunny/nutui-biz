# nutui-biz-taro 开发约定

本仓库是 jdf2e/nutui-biz 的 fork, 已改为**只支持 Taro** (Taro 4.2 + @nutui/nutui-react-taro 3.x + React 18)。
参考实现: `src/packages/card/` 与 `src/packages/configprovider/`。

## 目录

```
src/packages/<name>/
  <name>.tsx     唯一实现 (没有 .taro.tsx / H5 双份)
  <name>.scss    样式
  index.ts       import 依赖的 NutUI 组件样式 + 自己的 scss, 导出组件与类型
  demo.tsx       demo 页 (被 demo/pages/<name>/index.tsx 转发)
  doc.md         中文文档, API 表格与实现保持一致
src/utils/       bem / rect (SelectorQuery 测量) / use-uuid / props / typings ...
src/styles/variables.scss   全局 $nb-* token (CSS 变量)
src/locales/     base.ts (类型) / zh-CN.ts / en-US.ts
demo/            Taro demo 小程序外壳; demo/components/DemoBlock.tsx
scripts/generate.mjs        由 src/config.json 生成 src/index.ts 与 demo 页面表
```

## 组件写法

- 只用 `@tarojs/components` (View / Text / Image / ScrollView / Input / Textarea ...) 与
  `@nutui/nutui-react-taro`。不写 div/span/img/a/ul/li/p/h1。
- 不碰 `window` / `document` / DOM 测量 / `addEventListener`。
  测量用 `utils/rect.ts` 的 `getRect('#id')` (异步); 节点 id 用 `utils/use-uuid.ts`。
  滚动用 `ScrollView` 的 `scrollTop` / `scrollLeft` / `scrollIntoView` / `onScroll`。
  屏幕宽度用 `getWindowWidth()`。
- 内部引用一律相对路径 (`../../utils/bem`), 不用 `@/` 别名。
- 函数组件不用 `defaultProps`, 用解构默认值。`displayName` 用 `Nb<Name>`。
- 图标用 `@nutui/icons-react-taro` 的具名 SVG 图标; 原先是字符串 icon 名的公共 props 改为 `ReactNode`。
- 文案走 `useConfig().locale.<组件>.<key>` (`../configprovider`), 不写死中文; 新 key 要同时加到
  `locales/base.ts`、`zh-CN.ts`、`en-US.ts`。
- 公共 props 里引用的 NutUI 类型用 3.x 的 (`import type { ButtonProps, PopupProps, ... } from '@nutui/nutui-react-taro'`)。
- NutUI 1.x → 3.x 常见改名: Popup `onClickOverlay→onOverlayClick`、`closeOnClickOverlay→closeOnOverlayClick`、
  `popClass→className`; InputNumber `modelValue→value`、`onChangeFuc→onChange`、`onAdd/onReduce→onPlus/onMinus`;
  TextArea `maxlength→maxLength`、`limitshow→showCount`; Image `isLazy/errorImg/loadingImg→lazy/error/loading`;
  Radio `Radio.RadioGroup→Radio.Group`; Rate `modelValue→value`、`readonly→readOnly`;
  Toast `Toast.text()` → `Toast.show(id, { content })` 且需要渲染 `<Toast id=... />`。
  拿不准就读 `node_modules/@nutui/nutui-react-taro/dist/es/types/spec/<组件>/base.d.ts` 与 `taro.d.ts`。

## 迁移中踩过的坑

- **Taro API 用具名导入** (`import { createSelectorQuery, nextTick } from '@tarojs/taro'`)。
  H5 端 `@tarojs/taro` 被换成 `@tarojs/taro-h5`; 业务方若没把本库放进 Taro 的 `compile.include`,
  默认导出对象上的 API 在 H5 是 undefined。
- **受控 `scrollTop` / `scrollLeft`**: Taro 4.2 H5 的 React 包装每次更新都把 props 直接赋给 DOM,
  ScrollView 一重渲染就会把用户的滚动位置拉回受控值。见 category 的处理 (memo + 先同步真实位置)。
- **NutUI 3 的 `--nutui-color-danger` 是浅粉 (#ffd6e1)**, 是浅底色不是错误文字色;
  `type="danger"` 的 Button / Tag 会发白。错误文字用 `$nb-color-danger` (已不回落到它), 强调按钮用 `type="primary"`。
- NutUI 图标颜色读 `--nut-icon-color`, 只设 `color` 不够。
- NutUI 3 `Input` 的 `readOnly` 在 Taro 里挡不住输入, 需要禁止输入用 `disabled`。

## 样式

- 每个 scss 第一行 `@import '../../styles/variables';`。
- 颜色 / 字号 / 间距 / 圆角只用 `$nb-*` token, 或在文件顶部定义组件级变量:
  `$nb-<name>-xxx: var(--nb-<name>-xxx, $nb-...);`。不写死十六进制颜色 (阴影的 rgba 除外)。
- 不覆写 NutUI 内部 class (`.nut-*`): 3.x 的 DOM 与 1.x 不同。调 NutUI 外观用组件 props 或它的 CSS 变量。
- 不用标签选择器 (`span` / `img` / `> *`) 和 `*` (WXSS 不支持); 给节点加 BEM class。
- 尺寸按 375 设计稿写 px (与 NutUI 一致)。
- `index.ts` 里 import 组件用到的每个 NutUI 组件的样式:
  `import '@nutui/nutui-react-taro/dist/es/packages/<nutui组件小写>/style/css'`, 再 import 自己的 scss。
- 暗色主题 (`.nut-theme-dark`) 块删除 —— 主题靠 CSS 变量覆写。

## 验证

```bash
npx tsc --noEmit -p .                                    # 全量类型检查
ONLY=card,sku node scripts/generate.mjs                  # 只生成这几个 demo 页
node -r ./scripts/taro-debug-hook.cjs node_modules/@tarojs/cli/bin/taro build --type weapp
node -r ./scripts/taro-debug-hook.cjs node_modules/@tarojs/cli/bin/taro build --type h5
```

Taro 构建失败时默认只打印 `[object Array]`, 用 `taro-debug-hook.cjs` 看真正的 webpack 错误。
输出目录可用 `OUT_DIR=dist-xxx` 覆盖 (并行构建时避免互相覆盖)。

## 业务方接入

- 源码接入 (如 git submodule): 把 `src/` 加进 Taro 的 `mini.compile.include` 与 `h5.compile.include`,
  对该路径使用 designWidth 375, 并保证 `@nutui/nutui-react-taro` / `@nutui/icons-react-taro` /
  `@tarojs/*` / `classnames` / `@bem-react/classname` 能从本库源码位置解析到 (只有一份 React)。
- **按组件路径引入** `nutui-biz-taro/packages/<name>`: 每个组件的 `index.ts` 会引入自己的样式,
  从 `src/index.ts` 整包引入会带上全部 30 个组件的样式。
- 主题: `<ConfigProvider theme={{ nbColorPrimary: '#...' }}>` 或直接在外层节点设置 `--nb-*` CSS 变量。
