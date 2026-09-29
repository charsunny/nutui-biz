import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { Textarea, View } from '@tarojs/components'
import { Button, Popup } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { appendTag } from './utils'

export interface OrderRemarkProps extends IComponent {
  visible: boolean
  /** 点击遮罩是否关闭弹窗 */
  closeOnClickOverlay: boolean
  maxLength: number
  placeholderText: string
  title: ReactNode
  tagTitle: ReactNode
  remark: string
  submitText: ReactNode
  recommendTags: string[]
  onClickOverlay: (val: string) => void
  onClose: (val: string) => void
  onOpen: () => void
  onChange: (val: string) => void
  onClickTag: (tag: string, index: number, remark: string) => void
  onSubmit: (val: string) => void
}

const EMPTY_TAGS: string[] = []

export const OrderRemark: FunctionComponent<Partial<OrderRemarkProps>> = ({
  visible = false,
  closeOnClickOverlay = true,
  maxLength = 50,
  placeholderText,
  title,
  tagTitle,
  remark = '',
  submitText,
  recommendTags = EMPTY_TAGS,
  className,
  style,
  onClickOverlay,
  onClose,
  onOpen,
  onChange,
  onClickTag,
  onSubmit,
}) => {
  const { locale } = useConfig()
  const b = bem('orderRemark')
  const [innerVisible, setInnerVisible] = useState(visible)
  const [innerMark, setInnerMark] = useState(remark)

  useEffect(() => {
    setInnerVisible(visible)
  }, [visible])

  useEffect(() => {
    setInnerMark(remark)
  }, [remark])

  const handleOpen = () => {
    setInnerMark(remark)
    onOpen?.()
  }

  const handleClose = () => {
    setInnerVisible(false)
    onClose?.(innerMark)
  }

  const handleOverlayClick = () => {
    onClickOverlay?.(innerMark)
    return true
  }

  const handleTagClick = (tag: string, index: number) => {
    const { full, value } = appendTag(innerMark, tag, maxLength)
    onClickTag?.(tag, index, full)
    setInnerMark(value)
    onChange?.(value)
  }

  const handleChange = (val: string) => {
    setInnerMark(val)
    onChange?.(val)
  }

  const handleSubmit = () => {
    onSubmit?.(innerMark)
    setInnerVisible(false)
  }

  return (
    <Popup
      visible={innerVisible}
      position="bottom"
      round
      closeable
      className={b('popup')}
      closeOnOverlayClick={closeOnClickOverlay}
      onOverlayClick={handleOverlayClick}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <View className={classNames(b(), className)} style={style}>
        <View className={b('title')}>{title || locale.orderRemark.title}</View>
        <View className={b('textarea-container')}>
          <View className={b('textarea-box')}>
            <Textarea
              className={b('textarea')}
              placeholderClass={b('placeholder')}
              placeholder={placeholderText || locale.orderRemark.placeholderText}
              maxlength={maxLength}
              value={innerMark}
              onInput={(e) => handleChange(e.detail.value)}
            />
            <View className={b('count')}>
              {innerMark.length}/{maxLength}
            </View>
          </View>
        </View>
        {recommendTags.length > 0 ? (
          <View className={b('tag-container')}>
            <View className={b('tag-title')}>{tagTitle || locale.orderRemark.tagTitle}</View>
            <View className={b('tag-content')}>
              {recommendTags.map((item, index) => (
                <View key={index} className={b('tag')} onClick={() => handleTagClick(item, index)}>
                  {item}
                </View>
              ))}
            </View>
          </View>
        ) : null}
        <View className={b('opt-container')}>
          <Button type="primary" block onClick={handleSubmit}>
            {submitText || locale.orderRemark.submitText}
          </Button>
        </View>
      </View>
    </Popup>
  )
}

OrderRemark.displayName = 'NbOrderRemark'
