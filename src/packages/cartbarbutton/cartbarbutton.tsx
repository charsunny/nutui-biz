import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'

/** 胶囊按钮组里的位置, 由 CartBar 在 hasCapsuleButtons 时注入, 一般不需要手动传 */
export type CartBarCapsulePosition = 'first' | 'middle' | 'last' | 'only'

export interface CartBarButtonProps extends IComponent {
  text: ReactNode
  buttonProps: Partial<ButtonProps>
  capsule: CartBarCapsulePosition
  onClick: () => void
}

const capsuleButtonStyle: CSSProperties = { borderRadius: 0 }

export const CartBarButton: FunctionComponent<Partial<CartBarButtonProps>> = ({
  className,
  style,
  text,
  buttonProps,
  capsule,
  onClick,
}) => {
  const b = bem('cart-bar-button')

  return (
    <View
      className={classNames(
        b({ capsule: !!capsule, [`capsule-${capsule}`]: !!capsule }),
        className
      )}
      style={style}
      onClick={() => onClick?.()}
    >
      <Button
        block
        {...buttonProps}
        style={
          capsule
            ? { ...buttonProps?.style, ...capsuleButtonStyle }
            : buttonProps?.style
        }
      >
        {text}
      </Button>
    </View>
  )
}

CartBarButton.displayName = 'NbCartBarButton'
