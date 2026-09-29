import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Badge } from '@nutui/nutui-react-taro'
import type { BadgeProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'

export interface CartBarIconProps extends IComponent {
  /** 图标, 传 @nutui/icons-react-taro 的具名图标或任意节点 (替代 1.x 的 iconProps) */
  icon: ReactNode
  text: ReactNode
  badgeProps: Partial<BadgeProps>
  onClick: () => void
}

export const CartBarIcon: FunctionComponent<Partial<CartBarIconProps>> = ({
  className,
  style,
  icon,
  text,
  badgeProps,
  onClick,
}) => {
  const b = bem('cart-bar-icon')

  const iconNode = <View className={b('icon')}>{icon}</View>

  return (
    <View
      className={classNames(b(), className)}
      style={style}
      onClick={() => onClick?.()}
    >
      {badgeProps ? <Badge {...badgeProps}>{iconNode}</Badge> : iconNode}
      {text !== undefined && text !== null && text !== '' &&
        (typeof text === 'string' || typeof text === 'number' ? (
          <Text className={b('text')}>{text}</Text>
        ) : (
          text
        ))}
    </View>
  )
}

CartBarIcon.displayName = 'NbCartBarIcon'
