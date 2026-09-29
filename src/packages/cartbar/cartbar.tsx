import { Children, Fragment, cloneElement, isValidElement, useEffect, useState } from 'react'
import type { FunctionComponent, ReactElement, ReactNode } from 'react'
import { nextTick } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { getRect } from '../../utils/rect'
import { useUuid } from '../../utils/use-uuid'
import type { IComponent } from '../../utils/typings'
import { CartBarButton } from '../cartbarbutton/cartbarbutton'
import type {
  CartBarButtonProps,
  CartBarCapsulePosition,
} from '../cartbarbutton/cartbarbutton'

export interface CartBarProps extends IComponent {
  /** 按钮是否拼成一组胶囊 */
  hasCapsuleButtons: boolean
  safeAreaInsetBottom: boolean
  /** fixed 时, 是否在原位置生成等高占位 */
  placeholder: boolean
  /** 是否固定在页面底部; false 时按普通块级元素渲染 */
  fixed: boolean
  top: ReactNode
}

const isCartBarButton = (node: ReactNode): node is ReactElement<Partial<CartBarButtonProps>> =>
  isValidElement(node) && node.type === CartBarButton

/** 展开 Fragment, 便于找到直接写在 CartBar 里的 CartBarButton */
const flatten = (children: ReactNode, prefix = ''): ReactNode[] =>
  Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child]
    const key = `${prefix}${child.key ?? ''}`
    if (child.type === Fragment) return flatten(child.props.children, `${key}/`)
    return [prefix ? cloneElement(child, { key }) : child]
  })

/** 给 CartBarButton 注入胶囊位置 */
const withCapsule = (children: ReactNode): ReactNode => {
  const list = flatten(children)
  const buttonIndexes = list
    .map((child, index) => (isCartBarButton(child) ? index : -1))
    .filter((index) => index >= 0)
  if (!buttonIndexes.length) return list
  const first = buttonIndexes[0]
  const last = buttonIndexes[buttonIndexes.length - 1]
  return list.map((child, index) => {
    if (!isCartBarButton(child)) return child
    let capsule: CartBarCapsulePosition = 'middle'
    if (first === last) capsule = 'only'
    else if (index === first) capsule = 'first'
    else if (index === last) capsule = 'last'
    return cloneElement(child, { capsule: child.props.capsule ?? capsule })
  })
}

export const CartBar: FunctionComponent<Partial<CartBarProps>> = ({
  children,
  className,
  style,
  safeAreaInsetBottom = true,
  placeholder = false,
  fixed = true,
  top,
  hasCapsuleButtons = false,
}) => {
  const b = bem('cart-bar')
  const id = useUuid('nb-cart-bar')
  const [height, setHeight] = useState(0)
  const needPlaceholder = fixed && placeholder

  useEffect(() => {
    if (!needPlaceholder) return
    let alive = true
    nextTick(() => {
      getRect(`#${id}`).then((rect) => {
        if (alive) setHeight(rect.height)
      })
    })
    return () => {
      alive = false
    }
  }, [needPlaceholder, id, top, children])

  const bar = (
    <View
      id={id}
      className={classNames(
        b({ fixed, 'safe-area': safeAreaInsetBottom }),
        className
      )}
      style={style}
    >
      {top}
      <View className={b('inner', { capsule: hasCapsuleButtons })}>
        {hasCapsuleButtons ? withCapsule(children) : children}
      </View>
    </View>
  )

  if (!needPlaceholder) return bar

  return (
    <View className={b('placeholder')} style={{ height: `${height}px` }}>
      {bar}
    </View>
  )
}

CartBar.displayName = 'NbCartBar'
