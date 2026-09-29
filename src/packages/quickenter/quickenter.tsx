import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import type { BaseEventOrig, ScrollViewProps } from '@tarojs/components'
import { Swiper, SwiperItem } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import Unit from '../../utils/unit'
import { getRect } from '../../utils/rect'
import { useUuid } from '../../utils/use-uuid'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { chunkPages, getItemWidth, getRowCount, getSlideBarOffset } from './utils'

export interface QuickEnterData {
  /** 展示名称 */
  displayName: string
  /** 图标: 图片链接, 或自定义节点 */
  imageUrl: ReactNode
  [key: string]: any
}

export interface QuickEnterProps extends IComponent {
  /** 每行展示几个 */
  columns: numericProp
  /** 每屏展示几行 */
  rows: numericProp
  data: QuickEnterData[]
  /** 多屏展示方式: swiper 轮播翻页 / slide 横向滑动 */
  slideMode: 'swiper' | 'slide'
  /** 图标宽高, 单位 px */
  iconSize: numericProp[]
  /** swiper 模式是否展示指示器 */
  indicatorVisible: boolean
  /** 指示器 (slide 模式为滚动条轨道) 背景色, 默认跟随主题 */
  indicatorBgColor: string
  /** 指示器 (slide 模式为滚动条滑块) 选中色, 默认跟随主题主色 */
  indicatorActiveColor: string
  onClickItem: (item: QuickEnterData) => void
}

type ScrollEvent = BaseEventOrig<ScrollViewProps.onScrollDetail>

/** 一个图标项除图标外的高度: margin-top 5 + 文字间距 10 + 文字 18 + margin-bottom 13 */
const ITEM_EXTRA_HEIGHT = 46
/** slide 模式滚动条滑块占轨道的百分比 */
const THUMB_PERCENT = 50

export const QuickEnter: FunctionComponent<Partial<QuickEnterProps>> = ({
  className,
  style,
  columns = 5,
  rows = 2,
  data = [],
  slideMode = 'swiper',
  iconSize = [30, 30],
  indicatorVisible = false,
  indicatorBgColor,
  indicatorActiveColor,
  onClickItem,
}) => {
  const b = bem('quick-enter')
  const uid = useUuid('nb-quick-enter')

  const pages = useMemo(
    () => chunkPages(data, Number(columns) * Number(rows)),
    [data, columns, rows]
  )
  const itemWidth = getItemWidth(columns)
  const iconStyle: CSSProperties = {
    width: Unit.pxAdd(iconSize[0] ?? 30),
    height: Unit.pxAdd(iconSize[1] ?? iconSize[0] ?? 30),
  }

  // ---- swiper 模式: Taro Swiper 需要显式高度, 先估算, 渲染后按首屏实际高度校正 ----
  const estimatedHeight =
    getRowCount(pages[0]?.length || 0, columns, rows) *
    (Number(iconSize[1] ?? iconSize[0] ?? 30) + ITEM_EXTRA_HEIGHT)
  const [swiperHeight, setSwiperHeight] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slideMode !== 'swiper' || !pages.length) return undefined
    const timer = setTimeout(async () => {
      const rect = await getRect(`#${uid}-page-0`)
      if (rect.height) setSwiperHeight(Math.ceil(rect.height))
    }, 50)
    return () => clearTimeout(timer)
  }, [slideMode, pages, uid, iconSize[0], iconSize[1]])

  useEffect(() => {
    if (current >= pages.length && current !== 0) setCurrent(0)
  }, [pages.length, current])

  // ---- slide 模式: 自定义滚动条 ----
  const [barOffset, setBarOffset] = useState(0)
  const onSlideScroll = (e: ScrollEvent) => {
    const { scrollLeft, scrollWidth } = e.detail
    setBarOffset(getSlideBarOffset(scrollLeft, scrollWidth, THUMB_PERCENT))
  }

  const renderItems = (items: QuickEnterData[]) =>
    items.map((item, index) => (
      <View
        key={`${item.displayName}-${index}`}
        className={b('item')}
        style={{ width: itemWidth }}
        onClick={() => onClickItem?.(item)}
      >
        {typeof item.imageUrl === 'string' ? (
          <Image className={b('icon')} src={item.imageUrl} style={iconStyle} mode="aspectFit" />
        ) : (
          <View className={b('icon')} style={iconStyle}>
            {item.imageUrl}
          </View>
        )}
        <Text className={b('desc')}>{item.displayName}</Text>
      </View>
    ))

  const renderSwiper = () => {
    const height = `${swiperHeight || estimatedHeight}px`
    return (
      <View className={b('swiper')}>
        <Swiper
          height={height}
          autoplay={false}
          loop={false}
          indicator={false}
          onChange={(e) => setCurrent(e.detail.current)}
        >
          {pages.map((page, index) => (
            <SwiperItem key={`page-${index}`}>
              <View id={`${uid}-page-${index}`} className={b('page')}>
                {renderItems(page)}
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        {indicatorVisible && pages.length > 1 && (
          <View className={b('indicator')}>
            {pages.map((_, index) => (
              <View
                key={`dot-${index}`}
                className={b('indicator-dot', { active: index === current })}
                style={{
                  background:
                    index === current ? indicatorActiveColor : indicatorBgColor,
                }}
              />
            ))}
          </View>
        )}
      </View>
    )
  }

  const renderSlide = () => (
    <View className={b('slide')}>
      <ScrollView
        className={b('scroll')}
        scrollX
        enhanced
        showScrollbar={false}
        onScroll={onSlideScroll}
      >
        {pages.map((page, index) => (
          <View key={`page-${index}`} className={b('page', { slide: true })}>
            {renderItems(page)}
          </View>
        ))}
      </ScrollView>
      {pages.length > 1 && (
        <View className={b('bar')} style={{ background: indicatorBgColor }}>
          <View
            className={b('bar-thumb')}
            style={{
              left: `${barOffset}%`,
              width: `${THUMB_PERCENT}%`,
              background: indicatorActiveColor,
            }}
          />
        </View>
      )}
    </View>
  )

  return (
    <View className={classNames(b(), className)} style={style}>
      {pages.length > 0 && (slideMode === 'slide' ? renderSlide() : renderSwiper())}
    </View>
  )
}

QuickEnter.displayName = 'NbQuickEnter'
