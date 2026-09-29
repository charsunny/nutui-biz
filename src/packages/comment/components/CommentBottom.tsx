import { useState } from 'react'
import type { FunctionComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { Comment as CommentIcon, Fabulous, More } from '@nutui/icons-react-taro'
import { useConfig } from '../../configprovider'
import bem from '../../../utils/bem'
import type { CommentInfo } from '../comment'

export interface CommentBottomProps {
  type: 'default' | 'complex'
  info?: CommentInfo
  operation: string[]
  onHandleClick?: () => void
  onClickOperate?: (type: string) => void
}

export const CommentBottom: FunctionComponent<CommentBottomProps> = ({
  type,
  info,
  operation,
  onHandleClick,
  onClickOperate,
}) => {
  const { locale } = useConfig()
  const b = bem('comment-bottom')
  const [showPopover, setShowPopover] = useState(false)

  const operate = (name: string) => {
    if (name === 'more') setShowPopover((v) => !v)
    onClickOperate?.(name)
  }

  return (
    <View className={b()}>
      <View className={b('label')} onClick={() => onHandleClick?.()}>
        {type !== 'complex' && info?.size ? <Text>{info.size}</Text> : null}
      </View>
      <View className={b('cpx')}>
        {operation.map((name) => (
          <View
            className={b('cpx-item', { [name]: true })}
            onClick={() => operate(name)}
            key={name}
          >
            {name === 'reply' ? (
              <>
                <Text className={b('cpx-count')}>{info?.reply}</Text>
                <CommentIcon size={14} />
              </>
            ) : null}
            {name === 'like' ? (
              <>
                <Text className={b('cpx-count')}>{info?.like}</Text>
                <Fabulous size={14} />
              </>
            ) : null}
            {name === 'more' ? (
              <>
                <More size={14} />
                {showPopover ? (
                  <View
                    className={b('popover')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowPopover(false)
                      onClickOperate?.('popover')
                    }}
                  >
                    {locale.comment.complaintsText}
                  </View>
                ) : null}
              </>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  )
}

CommentBottom.displayName = 'NbCommentBottom'
