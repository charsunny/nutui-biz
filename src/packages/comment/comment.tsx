import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { ArrowRight } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { CommentHeader } from './components/CommentHeader'
import { CommentBottom } from './components/CommentBottom'
import { CommentImages } from './components/CommentImages'
import type {
  VideosType,
  ImagesType,
  GoodsClickParams,
} from './components/CommentImages'

export type { VideosType, ImagesType, GoodsClickParams }

export interface CommentInfo {
  /** 评论详情 */
  content: string
  /** 评论人的姓名 */
  nickName: string
  /** 评论星星数 */
  score: number
  /** 评论人头像 */
  avatar: string
  /** 评论时间 */
  time: string
  /** 评论人购买的商品规格 */
  size?: string
  /** 此评论的回复数 */
  reply?: number
  /** 此评论的点赞数 */
  like?: number
}

export interface CommentFollow {
  /** 购买多少天后进行追评 */
  days: number
  /** 追评内容 */
  content: string
  /** 追评图片 */
  images?: string[]
}

export interface CommentProps extends IComponent {
  type: 'default' | 'complex'
  imagesRows: 'one' | 'multi'
  ellipsis: string | number
  videos: VideosType[]
  images: ImagesType[]
  info: CommentInfo
  follow: CommentFollow
  operation: string[]
  commentLabels: ReactNode
  commentShopReply: ReactNode
  onClickOperate: (type: string) => void
  onClick: (info: CommentInfo | undefined) => void
  onClickImages: (imgs: GoodsClickParams) => void
}

const EMPTY: never[] = []
const DEFAULT_OPERATION = ['reply', 'like', 'more']

export const Comment: FunctionComponent<Partial<CommentProps>> = ({
  className,
  style,
  type = 'default',
  imagesRows = 'one',
  ellipsis = 2,
  videos = EMPTY,
  images = EMPTY,
  info,
  follow,
  operation = DEFAULT_OPERATION,
  commentLabels,
  commentShopReply,
  onClickOperate,
  onClick,
  onClickImages,
}) => {
  const { locale } = useConfig()
  const b = bem('comment')

  const handleClick = () => onClick?.(info)

  const lines = Number(ellipsis) || (type === 'complex' ? 6 : 2)
  const mainStyle = { WebkitLineClamp: String(lines) } as CSSProperties

  return (
    <View className={classNames(b(), className)} style={style}>
      <CommentHeader
        type={type}
        info={info}
        commentLabels={commentLabels}
        onHandleClick={handleClick}
      />

      {info?.content ? (
        <View className={b('main')} style={mainStyle} onClick={handleClick}>
          {info.content}
        </View>
      ) : null}

      <CommentImages
        images={images}
        videos={videos}
        type={imagesRows}
        onClickImages={onClickImages}
      />

      {follow && follow.days > 0 ? (
        <View className={b('follow')} onClick={handleClick}>
          <View className={b('follow-title')}>
            {locale.comment.additionalReview(follow.days)}
          </View>
          <View className={b('follow-com')}>{follow.content}</View>
          {follow.images && follow.images.length > 0 ? (
            <View className={b('follow-img')}>
              <Text>{locale.comment.additionalImages(follow.images.length)}</Text>
              <ArrowRight size={12} />
            </View>
          ) : null}
        </View>
      ) : null}

      <CommentBottom
        type={type}
        info={info}
        operation={operation}
        onClickOperate={onClickOperate}
        onHandleClick={handleClick}
      />

      {commentShopReply ? (
        <View className={b('shop')}>{commentShopReply}</View>
      ) : null}
    </View>
  )
}

Comment.displayName = 'NbComment'
