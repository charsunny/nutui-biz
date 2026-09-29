# nutui-biz-taro

京东风格的移动端业务组件库, fork 自 [jdf2e/nutui-biz](https://github.com/jdf2e/nutui-biz),
改造为**只支持 Taro** 的版本:

- Taro 4.2 + [@nutui/nutui-react-taro](https://github.com/jdf2e/nutui-react) 3.x + React 18
- 30 个组件统一为单份 Taro 实现 (View / Text / ScrollView ...), 无 DOM 依赖, 微信小程序与 H5 同源
- 主题走 CSS 变量: `--nb-*` → `--nutui-*` → 默认值, 可运行时整体换色
- 每个组件自带样式按需引入

## 组件

| 分类 | 组件 |
| --- | --- |
| 商品类 | Card 商品卡片 · CartBar / CartBarButton / CartBarIcon 购物车栏 · Category 商品分类 · Comment 评论 · Ecard 电子卡 · GoodsFilter 商品筛选 · QuickEnter 快捷入口 · SearchHistory 搜索历史 · SettleBar 结算栏 · Sku 规格选择 · ProductFeed 商品 Feed 流 |
| 订单类 | Address 地址 · AddressEdit 地址编辑 · AddressList 地址列表 · Delivery (+DeliveryDate / DeliveryDateTime / DeliveryDateTimeAccurate) 配送 · OrderCancelPanel 订单取消面板 · OrderRemark 订单备注 |
| 发票类 | InvoiceTitleEdit / InvoiceTitleList 发票抬头 · ReceiveInvoiceEdit / ReceiveInvoiceList 收票人 |
| 其他 | Coupon 优惠券 · HorizontalScrolling 横向滚动 · Login 登录 · ConfigProvider 全局配置 |

各组件文档见 `src/packages/<name>/doc.md` (含与 1.x 的差异)。

## 使用

以源码方式接入 (例如 git submodule), 见 [AGENTS.md](./AGENTS.md#业务方接入)。按组件路径引入:

```tsx
import { Sku } from 'nutui-biz-taro/packages/sku'
import { ConfigProvider } from 'nutui-biz-taro/packages/configprovider'

<ConfigProvider theme={{ nbColorPrimary: '#0f7b6c' }}>
  <Sku visible={visible} sku={sku} goods={goods} onClose={() => setVisible(false)} />
</ConfigProvider>
```

## 开发

```bash
bun install
bun run dev:weapp        # demo 小程序 (微信开发者工具打开仓库根目录)
bun run dev:h5           # demo H5
bun run check-types
bun run test
```

开发约定见 [AGENTS.md](./AGENTS.md)。

## License

MIT
