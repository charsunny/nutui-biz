import { memo, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button, Checkbox, Popup, Switch, TextArea } from '@nutui/nutui-react-taro'
import type { ButtonProps, PopupProps, TextAreaProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'
import { buildSubmitPayload, INITIAL_REASON_STATE, toggleReason } from './utils'
import type { IreasonsObject, ReasonState } from './utils'

export type { IreasonsObject } from './utils'

export type ICheckboxPosition = 'front' | 'back'

export interface OrderCancelPanelProps extends IComponent {
  showCancelPanel: boolean
  warmTips: string[]
  cancelReason: IreasonsObject[]
  canCancelReason: boolean
  popupTitle: ReactNode
  reasonTitle: ReactNode
  submitText: ReactNode
  tipsTitle: ReactNode
  /** 提交按钮的 props (NutUI 3.x Button) */
  buttonProps: Partial<ButtonProps>
  /** "其它原因" 输入框的 props (NutUI 3.x TextArea) */
  textAreaProps: Partial<Omit<TextAreaProps, 'defaultValue' | 'value' | 'onChange'>>
  /** 弹窗的 props (NutUI 3.x Popup) */
  popupProps: Partial<PopupProps>
  checkboxType: ICheckboxPosition
  safeAreaCancelBottom: boolean
  showBtntips: boolean
  /** 按钮区域提示文案 */
  btnTipsText: ReactNode
  onClose: () => void
  /** 未选择原因时 selectedReason 为 undefined */
  onSubmitBtn: (
    selectedReason: IreasonsObject,
    textAreaValue: string,
    switchStatus: boolean
  ) => void
}

const OrderCancelPanelInner: FunctionComponent<Partial<OrderCancelPanelProps>> = ({
  popupProps,
  showCancelPanel = false,
  className,
  style,
  warmTips,
  cancelReason,
  reasonTitle,
  popupTitle,
  canCancelReason = false,
  submitText,
  tipsTitle,
  buttonProps,
  textAreaProps,
  showBtntips = false,
  btnTipsText,
  safeAreaCancelBottom = false,
  checkboxType = 'back',
  onClose,
  onSubmitBtn,
}) => {
  const { locale } = useConfig()
  const b = bem('ordercancel')
  const [reasonState, setReasonState] = useState<ReasonState>(INITIAL_REASON_STATE)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [switchStatus, setSwitchStatus] = useState(false)

  const checkedReason = (item: IreasonsObject) => {
    setReasonState((prev) => toggleReason(prev, item.key, canCancelReason))
  }

  const submitContent = () => {
    const { reason, text } = buildSubmitPayload(cancelReason, reasonState.activeKey, textAreaValue)
    if (!text) setTextAreaValue('')
    onSubmitBtn?.(reason as IreasonsObject, text, switchStatus)
  }

  // 关闭弹窗时清空选择
  const closePopup = () => {
    setReasonState(INITIAL_REASON_STATE)
    setTextAreaValue('')
    setSwitchStatus(false)
    popupProps?.onClose?.()
    onClose?.()
  }

  const tipsHeader = tipsTitle ?? locale.orderCancelPanel.tipsTitle

  const renderCheckbox = (item: IreasonsObject, front: boolean) => (
    <View className={b('reason-checkbox', { front })}>
      <Checkbox checked={reasonState.activeKey === item.key} />
    </View>
  )

  return (
    <Popup
      {...popupProps}
      visible={showCancelPanel}
      position="bottom"
      round
      closeable
      style={{ ...popupProps?.style, ...style }}
      className={classNames(b(), popupProps?.className, className)}
      onClose={closePopup}
    >
      <View className={b('main')}>
        {popupTitle ? <View className={b('header')}>{popupTitle}</View> : null}
        {warmTips && warmTips.length > 0 ? (
          <View className={b('tips')}>
            {tipsHeader ? <View className={b('tips-header')}>{tipsHeader}</View> : null}
            {warmTips.map((item, index) => (
              <View key={index} className={b('tips-list')}>
                {item}
              </View>
            ))}
          </View>
        ) : null}
        {reasonTitle ? <View className={b('reason-header')}>{reasonTitle}</View> : null}
        {cancelReason ? (
          <View className={b('reason')}>
            {cancelReason.map((item) => {
              const front = checkboxType === 'front'
              return (
                <View key={item.key} className={b('reason-item')} onClick={() => checkedReason(item)}>
                  {front ? renderCheckbox(item, true) : null}
                  <View className={b('reason-label')}>{item.value}</View>
                  {front ? null : renderCheckbox(item, false)}
                </View>
              )
            })}
            {reasonState.showOtherText ? (
              <View className={b('area')}>
                <TextArea
                  {...textAreaProps}
                  className={classNames(b('area-input'), textAreaProps?.className)}
                  value={textAreaValue}
                  onChange={(val) => setTextAreaValue(val)}
                />
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
      <View className={b('btns', { safe: safeAreaCancelBottom })}>
        {showBtntips ? (
          <View className={b('btns-tips')}>
            <View className={b('btns-tips-text')}>
              {btnTipsText ?? locale.orderCancelPanel.btnTipsText}
            </View>
            <Switch checked={switchStatus} onChange={(val) => setSwitchStatus(val)} />
          </View>
        ) : null}
        <View className={b('btns-button')}>
          <Button type="primary" block {...buttonProps} onClick={submitContent}>
            {submitText ?? locale.orderCancelPanel.submitText}
          </Button>
        </View>
      </View>
    </Popup>
  )
}

export const OrderCancelPanel = memo(OrderCancelPanelInner) as FunctionComponent<
  Partial<OrderCancelPanelProps>
>

OrderCancelPanel.displayName = 'NbOrderCancelPanel'
