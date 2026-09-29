import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Image, Price } from '@nutui/nutui-react-taro'
import type { ImageProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import { errorImg } from '../../utils'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import bem from '../../utils/bem'

export interface CardProps extends IComponent {
  title: string
  price: ReactNode
  shopName: string
  /** full-line: 左图右文; half-line: 上图下文 (双列) */
  showType: 'full-line' | 'half-line'
  titleLine: numericProp
  prolistTpl: ReactNode
  productTagsTpl: ReactNode
  priceAfterTpl: ReactNode
  bottomTpl: ReactNode
  infoTpl: ReactNode
  imgTag: ReactNode
  titleTag: ReactNode
  isNeedPrice: boolean
  imgTagDirection: 'top-left' | 'top-right'
  imageProps: Partial<ImageProps>
  onClick: () => void
  onClickShop: () => void
}

const defaultImageProps: Partial<ImageProps> = {
  lazy: false,
  mode: 'aspectFill',
  error: <Image src={errorImg} width="100%" height="100%" />,
}

export const Card: FunctionComponent<Partial<CardProps>> = ({
  className,
  style,
  titleLine = 2,
  title,
  price,
  shopName,
  imgTag,
  titleTag,
  imageProps,
  isNeedPrice = true,
  productTagsTpl,
  priceAfterTpl,
  prolistTpl,
  bottomTpl,
  infoTpl,
  imgTagDirection = 'top-left',
  showType = 'full-line',
  onClick,
  onClickShop,
}) => {
  const b = bem('card')
  const lines = Number(titleLine)
  const isFullLine = showType !== 'half-line'

  const titleStyle: CSSProperties | undefined =
    lines > 1 ? ({ WebkitLineClamp: String(lines) } as CSSProperties) : undefined

  return (
    <View
      className={classNames(b({ 'half-line': !isFullLine }), className)}
      style={style}
      onClick={() => onClick?.()}
    >
      <View className={b('main')}>
        <View className={b('left')}>
          {imgTag && (
            <View className={b('img-tag', { [imgTagDirection]: true })}>
              {imgTag}
            </View>
          )}
          <Image
            className={b('image')}
            width="100%"
            height="100%"
            {...defaultImageProps}
            {...imageProps}
          />
        </View>
        <View className={b('right')}>
          {infoTpl || (
            <>
              {title && (
                <View
                  className={b('title', {
                    'one-line': lines === 1,
                    'multiple-lines': lines > 1,
                  })}
                  style={titleStyle}
                >
                  {titleTag}
                  <Text>{title}</Text>
                </View>
              )}
              {isFullLine && prolistTpl}
              {isNeedPrice && (
                <View className={b('price')}>
                  {typeof price === 'number' || typeof price === 'string' ? (
                    <Price price={price} size="normal" />
                  ) : (
                    price
                  )}
                  {priceAfterTpl}
                </View>
              )}
              {productTagsTpl}
              {shopName && (
                <View
                  className={b('shop')}
                  onClick={(e) => {
                    if (!isFullLine) return
                    e.stopPropagation()
                    onClickShop?.()
                  }}
                >
                  <Text className={b('shop-name')}>{shopName}</Text>
                  <Text className={b('shop-arrow')}>&gt;</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      {bottomTpl}
    </View>
  )
}

Card.displayName = 'NbCard'
