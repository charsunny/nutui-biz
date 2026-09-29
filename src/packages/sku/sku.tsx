import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Popup } from '@nutui/nutui-react-taro'
import type { PopupProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { SkuHeader } from './skuHeader'
import type { SkuGoods } from './skuHeader'
import { SkuSelect } from './skuSelect'
import { SkuStepper } from './skuStepper'
import { SkuOperate } from './skuOperate'
import type { SkuOperateType } from './skuOperate'
import type { SkuSelectInfo, SkuSpec } from './utils'

export interface SkuOperateInfo {
  /** 按钮类型: confirm / buy / cart */
  type: SkuOperateType | string
  /** 当前购买数量 */
  value: number
}

export interface SkuProps extends IComponent {
  visible: boolean
  skuHeaderPrice: ReactNode
  skuHeaderExtra: ReactNode
  skuHeader: ReactNode
  skuSelectTop: ReactNode
  skuSelect: ReactNode
  skuStepper: ReactNode
  skuStepperBottom: ReactNode
  skuOperate: ReactNode
  operateBtn: ReactNode
  goods: Partial<SkuGoods>
  sku: SkuSpec[]
  stepperMax: string | number
  stepperMin: string | number
  stepperExtraText: (() => ReactNode) | boolean
  stepperTitle: string
  btnOptions: Array<SkuOperateType | string>
  btnExtraText: string
  buyText: string
  addCartText: string
  confirmText: string
  /** 透传给 NutUI Popup 的 props (3.x) */
  popupProps: Partial<PopupProps>
  onClickBtnOperate: (info: SkuOperateInfo) => void
  onClose: () => void
  onClickCloseIcon: () => void
  onClickOverlay: () => void
  onSelectSku: (info: SkuSelectInfo) => void
  onAdd: (value: number) => void
  onReduce: (value: number) => void
  onChangeStepper: (value: number) => void
  onOverLimit: () => void
}

export const Sku: FunctionComponent<Partial<SkuProps>> = ({
  visible = false,
  className,
  style,
  skuHeader,
  skuHeaderPrice,
  skuHeaderExtra,
  skuSelectTop,
  skuSelect,
  skuStepper,
  skuStepperBottom,
  skuOperate,
  goods,
  sku = [],
  stepperMax = 99999,
  stepperMin = 1,
  stepperExtraText = false,
  stepperTitle,
  btnOptions = ['confirm'],
  btnExtraText = '',
  buyText,
  addCartText,
  confirmText,
  operateBtn,
  popupProps,
  onClose,
  onClickOverlay,
  onClickCloseIcon,
  onSelectSku,
  onAdd,
  onReduce,
  onOverLimit,
  onChangeStepper,
  onClickBtnOperate,
}) => {
  const { locale } = useConfig()
  const b = bem('sku')
  const [goodsCount, setGoodsCount] = useState(Number(stepperMin))

  useEffect(() => {
    const min = Number(stepperMin)
    const max = Number(stepperMax)
    setGoodsCount((count) => Math.min(Math.max(count, min), max))
  }, [stepperMin, stepperMax])

  const handleChangeStepper = (value: number) => {
    setGoodsCount(value)
    onChangeStepper?.(value)
  }

  return (
    <Popup
      position="bottom"
      closeable
      round
      {...popupProps}
      visible={visible}
      onClose={() => {
        popupProps?.onClose?.()
        onClose?.()
      }}
      onCloseIconClick={(e) => {
        onClickCloseIcon?.()
        return popupProps?.onCloseIconClick ? popupProps.onCloseIconClick(e) : true
      }}
      onOverlayClick={(e) => {
        onClickOverlay?.()
        return popupProps?.onOverlayClick ? popupProps.onOverlayClick(e) : true
      }}
    >
      <View className={classNames(b(), className)} style={style}>
        {skuHeader || (
          <SkuHeader goods={goods} skuHeaderPrice={skuHeaderPrice} skuHeaderExtra={skuHeaderExtra} />
        )}
        <ScrollView className={b('content')} scrollY>
          {skuSelectTop}
          {skuSelect || <SkuSelect sku={sku} selectSku={(info) => onSelectSku?.(info)} />}
          {skuStepper || (
            <SkuStepper
              value={goodsCount}
              stepperTitle={stepperTitle ?? locale.sku.buyNumber}
              stepperMax={stepperMax}
              stepperMin={stepperMin}
              stepperExtraText={stepperExtraText}
              onAdd={onAdd}
              onReduce={onReduce}
              onOverLimit={onOverLimit}
              onChange={handleChangeStepper}
            />
          )}
          {skuStepperBottom}
        </ScrollView>
        <SkuOperate
          btnOptions={btnOptions}
          btnExtraText={btnExtraText}
          buyText={buyText ?? locale.sku.buyNow}
          addCartText={addCartText ?? locale.sku.addToCard}
          confirmText={confirmText ?? locale.sku.confirm}
          operateBtn={operateBtn}
          skuOperate={skuOperate}
          onClickBtnOperate={(type) => onClickBtnOperate?.({ type, value: goodsCount })}
        />
      </View>
    </Popup>
  )
}

Sku.displayName = 'NbSku'
