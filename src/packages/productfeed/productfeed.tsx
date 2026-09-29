import { useMemo } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { InfiniteLoading } from '@nutui/nutui-react-taro'
import type { InfiniteLoadingProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { errorImg as defaultErrorImg } from '../../utils'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { ProductFeedItem } from './productfeeditem'
import { getItemKey, splitColumns } from './utils'

export type colType = 1 | 2 | '1' | '2'

// NutUI 的声明把 ScrollView props 与 HTMLAttributes<HTMLDivElement> 取交集, 事件类型互相冲突,
// 直接展开 Partial<InfiniteLoadingProps> 会报错; 这里收窄成 Taro 端真实接受的 props。
const Infinite = InfiniteLoading as unknown as FunctionComponent<
  Partial<InfiniteLoadingProps> & { children?: ReactNode }
>

export interface ProductFeedProps extends IComponent {
  /** 商品数据 */
  data: any[]
  /** 商品唯一 key 的字段名 */
  itemKey: string
  /** 商品图片下方区域内容 */
  customProduct: (item: any) => ReactNode
  /** 是否开启上拉加载 (内部使用 NutUI 3 InfiniteLoading, 需要给组件一个固定高度) */
  openInfiniteloading: boolean
  /** 透传给 NutUI 3 InfiniteLoading 的 props (hasMore / onLoadMore / pullRefresh / onRefresh ...) */
  infiniteloadingProps: Partial<InfiniteLoadingProps>
  /**
   * @deprecated 1.x 中用于"每次 data 变化时最多追加展示的数量", 行为不可预期, 已不再生效;
   * 现在 data 里的商品全部展示。
   */
  initProductNum: number
  /** 每行商品数量 */
  col: colType
  /** 商品内边距, 数字默认单位 px */
  padding: numericProp
  /** 商品圆角, 数字默认单位 px */
  borderRadius: numericProp
  /** 商品图片地址所在的字段名 */
  imgUrl: string
  /** 商品图片宽度, 数字默认单位 px */
  imgWidth: numericProp
  /** 商品图片高度, 数字默认单位 px */
  imgHeight: numericProp
  /** 商品图片左上角标签 */
  imgTag: ReactNode
  /** 商品图片是否懒加载 */
  isImageLazy: boolean
  /** 图片加载中占位图 */
  loadingImg: string
  /** 图片加载失败占位图 */
  errorImg: string
  onClick: (item: any, index: number) => void
  onImageClick: (item: any, index: number) => void
}

export const ProductFeed: FunctionComponent<Partial<ProductFeedProps>> = ({
  className,
  style,
  data = [],
  itemKey = 'id',
  customProduct,
  openInfiniteloading = true,
  infiniteloadingProps,
  col = 2,
  padding = '10px',
  borderRadius = '8px',
  imgUrl = '',
  imgWidth = '150px',
  imgHeight = '150px',
  imgTag,
  isImageLazy = true,
  loadingImg = defaultErrorImg,
  errorImg = defaultErrorImg,
  onClick,
  onImageClick,
}) => {
  const b = bem('productfeed')
  const single = Number(col) === 1
  const columns = useMemo(() => splitColumns(data), [data])

  const renderItem = (item: any, index: number) => (
    <ProductFeedItem
      key={getItemKey(item, itemKey, index)}
      index={index}
      data={item}
      single={single}
      padding={padding}
      borderRadius={borderRadius}
      imgUrl={item?.[imgUrl]}
      imgWidth={imgWidth}
      imgHeight={imgHeight}
      imgTag={imgTag}
      isImageLazy={isImageLazy}
      loadingImg={loadingImg}
      errorImg={errorImg}
      onClick={onClick}
      onImageClick={onImageClick}
    >
      {customProduct?.(item)}
    </ProductFeedItem>
  )

  const product = (
    <View className={b('main', { single })}>
      {single ? (
        data.map(renderItem)
      ) : (
        <>
          <View className={b('left')}>
            {columns.left.map(({ item, index }) => renderItem(item, index))}
          </View>
          <View className={b('right')}>
            {columns.right.map(({ item, index }) => renderItem(item, index))}
          </View>
        </>
      )}
    </View>
  )

  return (
    <View
      className={classNames(b({ infinite: openInfiniteloading }), className)}
      style={style}
    >
      {openInfiniteloading ? (
        <Infinite {...infiniteloadingProps}>{product}</Infinite>
      ) : (
        product
      )}
    </View>
  )
}

ProductFeed.displayName = 'NbProductFeed'
