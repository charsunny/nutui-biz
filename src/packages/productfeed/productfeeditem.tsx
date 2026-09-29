import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View, Image as TaroImage } from '@tarojs/components'
import type { ITouchEvent } from '@tarojs/components'
import { Image } from '@nutui/nutui-react-taro'
import bem from '../../utils/bem'
import Unit from '../../utils/unit'
import type { numericProp } from '../../utils/props'

export interface ProductFeedItemProps {
  index: number
  data: any
  single: boolean
  padding: numericProp
  borderRadius: numericProp
  imgUrl: string
  imgWidth: numericProp
  imgHeight: numericProp
  imgTag?: ReactNode
  isImageLazy: boolean
  loadingImg?: string
  errorImg?: string
  children?: ReactNode
  onClick?: (item: any, index: number) => void
  onImageClick?: (item: any, index: number) => void
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = ({
  index,
  data,
  single,
  padding,
  borderRadius,
  imgUrl,
  imgWidth,
  imgHeight,
  imgTag,
  isImageLazy,
  loadingImg,
  errorImg,
  children,
  onClick,
  onImageClick,
}) => {
  const b = bem('productfeedItem')

  const itemStyle: CSSProperties = {
    borderRadius: Unit.pxAdd(borderRadius),
    padding: Unit.pxAdd(padding),
  }
  const width = Unit.pxAdd(imgWidth || imgHeight)
  const height = Unit.pxAdd(imgHeight || imgWidth)

  const handleImageClick = (e: ITouchEvent) => {
    e.stopPropagation()
    onImageClick?.(data, index)
  }

  return (
    <View
      className={b({ single, multiple: !single })}
      style={itemStyle}
      onClick={() => onClick?.(data, index)}
    >
      <View className={b('image')} style={{ width }} onClick={handleImageClick}>
        <Image
          className={b('img')}
          src={imgUrl || ''}
          width={width}
          height={height}
          mode="aspectFill"
          lazy={isImageLazy}
          lazyLoad={isImageLazy}
          loading={
            loadingImg ? <TaroImage className={b('placeholder')} src={loadingImg} /> : false
          }
          error={errorImg ? <TaroImage className={b('placeholder')} src={errorImg} /> : true}
        />
        {imgTag && <View className={b('image-tag')}>{imgTag}</View>}
      </View>
      <View className={b('content')}>{children}</View>
    </View>
  )
}

ProductFeedItem.displayName = 'NbProductFeedItem'
