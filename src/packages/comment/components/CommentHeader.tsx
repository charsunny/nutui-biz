import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Rate } from '@nutui/nutui-react-taro'
import bem from '../../../utils/bem'
import type { CommentInfo } from '../comment'

export interface CommentHeaderProps {
  type: 'default' | 'complex'
  info?: CommentInfo
  commentLabels?: ReactNode
  onHandleClick?: () => void
}

export const CommentHeader: FunctionComponent<CommentHeaderProps> = ({
  type,
  info,
  commentLabels,
  onHandleClick,
}) => {
  const b = bem('comment-header')

  return (
    <View>
      {info ? (
        <View className={b()} onClick={() => onHandleClick?.()}>
          <View className={b('user')}>
            <View className={b('user-avatar')}>
              {info.avatar ? (
                <Image className={b('user-avatar-img')} src={info.avatar} mode="aspectFill" />
              ) : null}
            </View>
            {type === 'default' ? (
              <View className={b('user-default')}>
                <View className={b('user-default-name')}>
                  {info.nickName ? (
                    <Text className={b('user-default-nick')}>{info.nickName}</Text>
                  ) : null}
                  {commentLabels}
                </View>
                <View className={b('score')}>
                  <Rate value={info.score} readOnly />
                </View>
              </View>
            ) : (
              <View className={b('user-complex')}>
                <Text className={b('user-complex-name')}>{info.nickName}</Text>
                {commentLabels}
              </View>
            )}
          </View>
          {info.time ? <View className={b('time')}>{info.time}</View> : null}
        </View>
      ) : null}
      {type === 'complex' && info ? (
        <View className={b('complex-score')}>
          <View className={b('score')}>
            <Rate value={info.score} readOnly />
          </View>
          <View className={b('complex-score-divider')} />
          <View className={b('complex-score-size')}>{info.size}</View>
        </View>
      ) : null}
    </View>
  )
}

CommentHeader.displayName = 'NbCommentHeader'
