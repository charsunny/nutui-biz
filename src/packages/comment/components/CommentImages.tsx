import type { FunctionComponent } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { ArrowRight } from '@nutui/icons-react-taro'
import { useConfig } from '../../configprovider'
import bem from '../../../utils/bem'

export interface VideosType {
  id?: number | string
  mainUrl?: string
  videoUrl?: string
}

export interface ImagesType {
  id?: number | string
  smallImgUrl?: string
  bigImgUrl?: string
  imgUrl?: string
}

export interface GoodsClickParams {
  /** video: 点击视频; img: 点击图片; more: 点击多行模式第 9 格的 "共 N 张" 遮罩 */
  type: 'video' | 'img' | 'more'
  /** 在 videos / images 各自数组里的下标 */
  index: number
  value: VideosType | ImagesType
}

export interface CommentImagesProps {
  type: 'one' | 'multi'
  videos: VideosType[]
  images: ImagesType[]
  onClickImages?: (imgs: GoodsClickParams) => void
}

/** 多行模式最多展示 9 格 */
const MULTI_MAX = 9

export const CommentImages: FunctionComponent<CommentImagesProps> = ({
  type,
  videos,
  images,
  onClickImages,
}) => {
  const { locale } = useConfig()
  const b = bem('comment-images')
  const multi = type === 'multi'
  const total = videos.length + images.length

  if (!total) return null

  const emit = (kind: GoodsClickParams['type'], index: number) => {
    onClickImages?.({
      type: kind,
      index,
      value: kind === 'video' ? videos[index] : images[index],
    })
  }

  const items = [
    ...videos.map((video, index) => (
      <View
        className={b('item', { video: true })}
        key={`v-${video.id ?? index}`}
        onClick={() => emit('video', index)}
      >
        <Image className={b('img')} src={video.mainUrl || ''} mode="aspectFill" />
        <View className={b('play')} />
      </View>
    )),
    ...images.map((image, index) => {
      const position = videos.length + index
      if (multi && position >= MULTI_MAX) return null
      const showMask = multi && total > MULTI_MAX && position === MULTI_MAX - 1
      return (
        <View
          className={b('item', { imgbox: true })}
          key={`i-${image.id ?? index}`}
          onClick={() => emit('img', index)}
        >
          <Image
            className={b('img')}
            src={image.smallImgUrl || image.imgUrl || ''}
            mode="aspectFill"
          />
          {showMask ? (
            <View
              className={b('mask')}
              onClick={(e) => {
                e.stopPropagation()
                emit('more', index)
              }}
            >
              <Text>{locale.comment.totalImages(total)}</Text>
              <ArrowRight size={12} />
            </View>
          ) : null}
        </View>
      )
    }),
  ]

  if (multi) {
    return <View className={b({ multi: true })}>{items}</View>
  }

  return (
    <ScrollView className={b({ one: true })} scrollX enhanced showScrollbar={false}>
      <View className={b('track')}>{items}</View>
    </ScrollView>
  )
}

CommentImages.displayName = 'NbCommentImages'
