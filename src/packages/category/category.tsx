import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, ScrollView } from '@tarojs/components'
import type { BaseEventOrig, ScrollViewProps } from '@tarojs/components'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import { errorImg as defaultErrorImg } from '../../utils'
import { getRect } from '../../utils/rect'
import { useUuid } from '../../utils/use-uuid'
import type { IComponent } from '../../utils/typings'
import { CategoryPane } from './categorypane'
import type { CategoryData, CategoryPaneItem } from './props'
import { useScrollTo } from './use-scroll-to'
import { getCenteredScrollOffset, toContentOffset } from './utils'

export interface CategoryProps extends IComponent {
  /** 分类数据 (一级 → 二级 → 三级) */
  category: CategoryData[]
  /** 三级分类是否展示图片 */
  showSkuImg: boolean
  /** 是否展示二级分类横向快捷导航 */
  showSecondLevelQuickNav: boolean
  /** 左侧一级导航选中项是否自动滚动到居中 */
  isLeftAutoSlide: boolean
  /** 三级分类图片是否懒加载 */
  isLazy: boolean
  /** 图片加载中占位图 */
  loadingImg: string
  /** 图片加载失败占位图 */
  errorImg: string
  /** 是否在右侧底部展示"向上拉继续浏览" */
  showPullUp: boolean
  pullUpText: ReactNode
  /** 点击左侧一级分类 */
  onChange: (category: CategoryData) => void
  /** 点击右侧二级分类快捷导航 */
  onPanelNavClick: (index: number) => void
  /** 点击右侧三级分类 */
  onPanelThirdClick: (sku: CategoryPaneItem) => void
}

type ScrollEvent = BaseEventOrig<ScrollViewProps.onScrollDetail>

export const Category: FunctionComponent<Partial<CategoryProps>> = ({
  className,
  style,
  category = [],
  showSkuImg = true,
  showSecondLevelQuickNav = false,
  isLeftAutoSlide = true,
  isLazy = true,
  loadingImg = defaultErrorImg,
  errorImg = defaultErrorImg,
  showPullUp = false,
  pullUpText,
  onChange,
  onPanelNavClick,
  onPanelThirdClick,
}) => {
  const { locale } = useConfig()
  const b = bem('category')
  const uid = useUuid('nb-category')
  const leftId = `${uid}-left`
  const [checkIndex, setCheckIndex] = useState(0)
  const left = useScrollTo()

  // 数据变短时, 选中项回到第一个
  useEffect(() => {
    if (checkIndex >= category.length && checkIndex !== 0) setCheckIndex(0)
  }, [category, checkIndex])

  /** 让左侧第 index 项滚动到居中 */
  const centerLeftItem = async (index: number) => {
    const [container, item] = await Promise.all([
      getRect(`#${leftId}`),
      getRect(`#${leftId}-${index}`),
    ])
    if (!container.height || !item.height) return
    const offset = toContentOffset(item.top, container.top, left.position.current)
    left.scrollTo(getCenteredScrollOffset(offset, item.height, container.height))
  }

  const changeTab = (index: number) => {
    if (index === checkIndex) return
    // 选中态变化会重渲染左侧 ScrollView, 先同步受控 scrollTop, 避免被拉回旧位置
    left.sync()
    setCheckIndex(index)
    if (isLeftAutoSlide) centerLeftItem(index)
    onChange?.(category[index])
  }

  if (!category.length) {
    return <View className={classNames(b(), className)} style={style} />
  }

  const current = category[checkIndex] || category[0]

  return (
    <View className={classNames(b(), className)} style={style}>
      <View className={b('cate-list')}>
        <ScrollView
          id={leftId}
          className={b('cate-list-left')}
          scrollY
          enhanced
          showScrollbar={false}
          scrollTop={left.value}
          scrollWithAnimation
          onScroll={(e: ScrollEvent) => left.track(e.detail.scrollTop)}
        >
          {category.map((item, index) => (
            <View
              key={`${item.catId}-${index}`}
              id={`${leftId}-${index}`}
              className={b('cate-list-item', { checked: checkIndex === index })}
              onClick={() => changeTab(index)}
            >
              {item.catName}
            </View>
          ))}
        </ScrollView>

        {/* key 变化时重建右侧面板: 切换一级分类后回到顶部、快捷导航回到第一项 */}
        <CategoryPane
          key={`${current.catId}-${checkIndex}`}
          categoryChild={current.children || []}
          showSkuImg={showSkuImg}
          showSecondLevelQuickNav={showSecondLevelQuickNav}
          isLazy={isLazy}
          loadingImg={loadingImg}
          errorImg={errorImg}
          showPullUp={showPullUp}
          pullUpText={pullUpText ?? locale.category.pullUpText}
          onPanelNavClick={onPanelNavClick}
          onPanelThirdClick={onPanelThirdClick}
        />
      </View>
    </View>
  )
}

Category.displayName = 'NbCategory'
