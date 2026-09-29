import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'

export type SkuOperateType = 'confirm' | 'buy' | 'cart'

export interface SkuOperateProps extends IComponent {
  btnOptions: Array<SkuOperateType | string>
  btnExtraText: ReactNode
  operateBtn: ReactNode
  skuOperate: ReactNode
  buyText: ReactNode
  addCartText: ReactNode
  confirmText: ReactNode
  onClickBtnOperate: (type: string) => void
}

export const SkuOperate: FunctionComponent<Partial<SkuOperateProps>> = ({
  btnOptions = [],
  btnExtraText,
  operateBtn,
  buyText,
  addCartText,
  confirmText,
  skuOperate,
  onClickBtnOperate,
}) => {
  const b = bem('sku')
  if (!btnOptions.length) return null

  const textMap: Record<string, ReactNode> = {
    confirm: confirmText,
    cart: addCartText,
    buy: buyText,
  }

  return (
    <View className={b('operate')}>
      {btnExtraText && <View className={b('operate-desc')}>{btnExtraText}</View>}
      {skuOperate}
      {operateBtn || (
        <View className={b('operate-btn')}>
          {btnOptions.map((btn) => (
            <View
              className={b('operate-btn-item', { [btn]: true })}
              key={btn}
              onClick={() => onClickBtnOperate?.(btn)}
            >
              <Text>{textMap[btn]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

SkuOperate.displayName = 'NbSkuOperate'
