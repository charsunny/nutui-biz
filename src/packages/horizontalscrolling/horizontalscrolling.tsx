import { useEffect, useRef } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import type { BaseEventOrig, ScrollViewProps } from '@tarojs/components'
import { Category as CategoryIcon } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import Unit from '../../utils/unit'
import { getRect } from '../../utils/rect'
import { useUuid } from '../../utils/use-uuid'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { getContentPaddingKey, isScrollReachEnd, nextReachEndState } from './utils'
import type { MaskPositionType } from './utils'

export type { MaskPositionType } from './utils'
export type MaskShadowTypeType = 'triangle' | 'shadow' | 'transparent' | 'none'

export interface HorizontalScrollingProps extends IComponent {
  /** 是否展示遮罩层 */
  showMask: boolean
  /** 遮罩层位置 */
  maskPosition: MaskPositionType
  /** 遮罩层阴影样式 */
  maskShadowType: MaskShadowTypeType
  /** 遮罩层宽度, 数字默认单位 px */
  maskWidth: numericProp
  /** 滚动内容与遮罩一侧容器边缘的距离, 数字默认单位 px */
  maskDistance: numericProp
  /** 自定义遮罩内容; 为空字符串时展示默认的 图标 + "更多" */
  maskContent: ReactNode
  /** 默认遮罩内容里的图标 (替代 1.x 的 iconProps) */
  icon: ReactNode
  onClickMask: () => void
  /** 滚动到最右侧时触发 (每次到达触发一次) */
  onScrollRight: () => void
  /** 滚动时触发, 参数为 scrollLeft */
  onScrollChange: (scrollLeft: number) => void
}

type ScrollEvent = BaseEventOrig<ScrollViewProps.onScrollDetail>

export const HorizontalScrolling: FunctionComponent<
  Partial<HorizontalScrollingProps>
> = ({
  className,
  style,
  children,
  showMask = true,
  maskPosition = 'right',
  maskShadowType = 'triangle',
  maskWidth = '100px',
  maskDistance = 0,
  maskContent = '',
  icon,
  onClickMask,
  onScrollRight,
  onScrollChange,
}) => {
  const { locale } = useConfig()
  const b = bem('horizontalscrolling')
  const uid = useUuid('nb-horizontalscrolling')
  const clientWidth = useRef(0)
  const reachedEnd = useRef(false)

  const measure = async () => {
    const rect = await getRect(`#${uid}`)
    clientWidth.current = rect.width
    return rect.width
  }

  useEffect(() => {
    const timer = setTimeout(measure, 50)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMask, maskPosition, maskWidth, maskShadowType])

  const handleScroll = async (e: ScrollEvent) => {
    const { scrollLeft, scrollWidth } = e.detail
    onScrollChange?.(scrollLeft)
    const width = clientWidth.current || (await measure())
    const [fire, reached] = nextReachEndState(
      reachedEnd.current,
      isScrollReachEnd(scrollLeft, width, scrollWidth)
    )
    reachedEnd.current = reached
    if (fire) onScrollRight?.()
  }

  const renderMask = () => (
    <View
      className={b('mask', {
        [maskPosition]: true,
        [maskShadowType]: true,
      })}
      style={{ width: Unit.pxAdd(maskWidth) }}
      onClick={() => onClickMask?.()}
    >
      {typeof maskContent !== 'string' ? (
        maskContent
      ) : (
        <View className={b('mask-box')}>
          <View className={b('mask-icon')}>{icon ?? <CategoryIcon size={16} />}</View>
          <Text className={b('mask-text')}>
            {maskContent || locale.horizontalscrolling.more}
          </Text>
        </View>
      )}
    </View>
  )

  return (
    <View className={classNames(b(), className)} style={style}>
      {maskPosition === 'left' && showMask && renderMask()}
      <ScrollView
        id={uid}
        className={b('contain')}
        scrollX
        enhanced
        showScrollbar={false}
        onScroll={handleScroll}
      >
        <View
          className={b('content')}
          style={{ [getContentPaddingKey(maskPosition)]: Unit.pxAdd(maskDistance) }}
        >
          {children}
        </View>
      </ScrollView>
      {maskPosition === 'right' && showMask && renderMask()}
    </View>
  )
}

HorizontalScrolling.displayName = 'NbHorizontalScrolling'
