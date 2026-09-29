import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, ScrollView, Image as TaroImage } from '@tarojs/components'
import type { BaseEventOrig, ScrollViewProps } from '@tarojs/components'
import { Image } from '@nutui/nutui-react-taro'
import { Top } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { getRect, getRects } from '../../utils/selector-query'
import { useUuid } from '../../utils/use-uuid'
import type { CategoryPaneData, CategoryPaneItem } from './props'
import { useScrollTo } from './use-scroll-to'
import {
  getActiveSectionIndex,
  getCenteredScrollOffset,
  toContentOffset,
} from './utils'
import type { SectionOffset } from './utils'

type ScrollEvent = BaseEventOrig<ScrollViewProps.onScrollDetail>

export interface CategoryPaneProps {
  categoryChild: CategoryPaneData[]
  showSkuImg: boolean
  showSecondLevelQuickNav: boolean
  isLazy: boolean
  loadingImg?: string
  errorImg?: string
  showPullUp: boolean
  pullUpText: ReactNode
  onPanelNavClick?: (index: number) => void
  onPanelThirdClick?: (sku: CategoryPaneItem) => void
}

/** 点击快捷导航后, 这段时间内的 onScroll 不参与高亮计算 (避免程序滚动被滚动监听覆盖) */
const NAV_LOCK_MS = 400

interface ScrollBodyProps {
  id: string
  className: string
  scrollTop: number
  onScroll: (e: ScrollEvent) => void
  children?: ReactNode
}

/**
 * 右侧内容区 ScrollView, 用 memo 隔离父组件的重渲染。
 *
 * Taro 4 H5 的 React 包装层 (attachProps) 每次更新都会把所有 props 直接赋值到 DOM 节点上,
 * 受控的 scrollTop 会在任意一次重渲染时把用户手动滚动的位置"拉回"到上次设置的值。
 * 快捷导航高亮变化只影响顶部, 不能让它触发这里的重渲染。
 */
const ScrollBody = memo(function ScrollBody({
  id,
  className,
  scrollTop,
  onScroll,
  children,
}: ScrollBodyProps) {
  return (
    <ScrollView
      id={id}
      className={className}
      scrollY
      enhanced
      showScrollbar={false}
      scrollTop={scrollTop}
      onScroll={onScroll}
    >
      {children}
    </ScrollView>
  )
})

export const CategoryPane: FunctionComponent<CategoryPaneProps> = ({
  categoryChild,
  showSkuImg,
  showSecondLevelQuickNav,
  isLazy,
  loadingImg,
  errorImg,
  showPullUp,
  pullUpText,
  onPanelNavClick,
  onPanelThirdClick,
}) => {
  const b = bem('category-pane')
  const uid = useUuid('nb-category-pane')
  const bodyId = `${uid}-body`
  const quickId = `${uid}-quick`
  const anchorClass = `${uid}-anchor`

  const [paneIndex, setPaneIndex] = useState(0)
  const paneIndexRef = useRef(0)
  const body = useScrollTo()
  const quick = useScrollTo()

  const sections = useRef<SectionOffset[] | null>(null)
  const viewportHeight = useRef(0)
  const contentHeight = useRef(0)
  const lockUntil = useRef(0)
  const spyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setActive = (index: number) => {
    paneIndexRef.current = index
    // 高亮变化会重渲染快捷导航, 先把它的受控 scrollLeft 同步为真实位置, 避免被拉回
    quick.sync()
    setPaneIndex(index)
  }

  /** 测量各分区相对滚动内容的偏移 */
  const measureSections = async () => {
    const [bodyRect, rects] = await Promise.all([
      getRect(`#${bodyId}`),
      getRects(`.${anchorClass}`),
    ])
    viewportHeight.current = bodyRect.height
    sections.current = rects.map((rect) => ({
      top: toContentOffset(rect.top, bodyRect.top, body.position.current),
      height: rect.height,
    }))
    return sections.current
  }

  useEffect(() => {
    sections.current = null
    if (!showSecondLevelQuickNav) return undefined
    const timer = setTimeout(measureSections, 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryChild, showSecondLevelQuickNav, showSkuImg])

  useEffect(
    () => () => {
      if (spyTimer.current) clearTimeout(spyTimer.current)
    },
    []
  )

  /** 让快捷导航里的第 index 项居中 */
  const scrollQuickNav = async (index: number) => {
    if (!showSecondLevelQuickNav) return
    const [container, item] = await Promise.all([
      getRect(`#${quickId}`),
      getRect(`#${quickId}-${index}`),
    ])
    if (!container.width || !item.width) return
    const offset = toContentOffset(item.left, container.left, quick.position.current)
    quick.scrollTo(getCenteredScrollOffset(offset, item.width, container.width))
  }

  const changePane = async (index: number) => {
    lockUntil.current = Date.now() + NAV_LOCK_MS
    setActive(index)
    scrollQuickNav(index)
    onPanelNavClick?.(index)
    const list = sections.current || (await measureSections())
    const target = index === 0 || !list[index] ? 0 : list[index].top
    lockUntil.current = Date.now() + NAV_LOCK_MS
    body.scrollTo(target)
  }

  const spy = async () => {
    spyTimer.current = null
    if (Date.now() < lockUntil.current) return
    const list = sections.current || (await measureSections())
    const index = getActiveSectionIndex(body.position.current, list, {
      viewportHeight: viewportHeight.current,
      contentHeight: contentHeight.current,
    })
    if (index !== paneIndexRef.current) {
      setActive(index)
      scrollQuickNav(index)
    }
  }

  const onBodyScroll = (e: ScrollEvent) => {
    body.track(e.detail.scrollTop)
    contentHeight.current = e.detail.scrollHeight
    if (!showSecondLevelQuickNav) return
    // 50ms trailing 节流, 保证最后一次滚动位置一定会被计算
    if (!spyTimer.current) spyTimer.current = setTimeout(() => spyRef.current(), 50)
  }

  // 传给 memo 子组件的回调保持引用稳定, 内部转发到最新的闭包
  const spyRef = useRef(spy)
  spyRef.current = spy
  const onBodyScrollRef = useRef(onBodyScroll)
  onBodyScrollRef.current = onBodyScroll
  const stableOnBodyScroll = useCallback((e: ScrollEvent) => onBodyScrollRef.current(e), [])
  const onThirdClickRef = useRef(onPanelThirdClick)
  onThirdClickRef.current = onPanelThirdClick

  const renderSku = (sku: CategoryPaneItem, idx: number) => (
    <View
      key={`${sku.catId}-${idx}`}
      className={b('child-item', { 'no-img': !showSkuImg })}
      onClick={() => onThirdClickRef.current?.(sku)}
    >
      {showSkuImg && (
        <Image
          className={b('child-img')}
          src={sku.backImg || ''}
          mode="aspectFill"
          lazy={isLazy}
          lazyLoad={isLazy}
          loading={
            loadingImg ? (
              <TaroImage className={b('child-img-placeholder')} src={loadingImg} />
            ) : (
              false
            )
          }
          error={
            errorImg ? (
              <TaroImage className={b('child-img-placeholder')} src={errorImg} />
            ) : (
              true
            )
          }
        />
      )}
      <Text className={b(showSkuImg ? 'sku-img' : 'sku-name')}>{sku.catName}</Text>
    </View>
  )

  const bodyContent = useMemo(
    () => (
      <>
        {categoryChild.map((child, index) => (
          <View
            key={`${child.catId}-${index}`}
            className={classNames(b('child-anchor'), anchorClass)}
          >
            <View className={b('child-title')}>{child.catName}</View>
            <View className={b('child-item-list')}>
              {child.children?.map(renderSku)}
            </View>
          </View>
        ))}
        {showPullUp && (
          <View className={b('cate-list-bottom')}>
            <View className={b('pull-up-icon')}>
              <Top size={12} />
            </View>
            <Text className={b('pull-up-text')}>{pullUpText}</Text>
          </View>
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryChild, showSkuImg, isLazy, loadingImg, errorImg, showPullUp, pullUpText, anchorClass]
  )

  return (
    <View className={b()}>
      {showSecondLevelQuickNav && (
        <ScrollView
          id={quickId}
          className={b('quick')}
          scrollX
          enhanced
          showScrollbar={false}
          scrollLeft={quick.value}
          onScroll={(e: ScrollEvent) => quick.track(e.detail.scrollLeft)}
        >
          <View className={b('quick-box')}>
            {categoryChild.map((child, index) => (
              <View
                key={`${child.catId}-${index}`}
                id={`${quickId}-${index}`}
                className={b('quick-child', { active: index === paneIndex })}
                onClick={() => changePane(index)}
              >
                {child.catName}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <ScrollBody
        id={bodyId}
        className={b('cate-list-right')}
        scrollTop={body.value}
        onScroll={stableOnBodyScroll}
      >
        {bodyContent}
      </ScrollBody>
    </View>
  )
}

CategoryPane.displayName = 'NbCategoryPane'
