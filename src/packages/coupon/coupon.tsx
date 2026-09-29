import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { formatCouponPrice } from './utils'

export type ButtonPropsType = ButtonProps

export interface ICouponType {
  /** 优惠券价格或者折扣 */
  price: numericProp
  /** 货币符号 / 单位 */
  currency: string
  mainTitle?: string
  subTitle?: string
  /** 使用时间范围 */
  timeRange?: string
  /** 左上角的标签内容 */
  label?: ReactNode
  [key: string]: any
}

export type CouponType = 'large' | 'small'
export type IPricePosition = 'front' | 'back'

export interface CouponProps extends IComponent {
  /** 优惠券的类型尺寸 */
  type: CouponType
  /** 优惠券的样式 (一般用来设置背景图与宽高) */
  couponStyle: CSSProperties
  /** 优惠券主体的样式 */
  couponMainStyle: CSSProperties
  /** 价格和单位的前后位置: front 价格在前, back 单位在前 */
  pricePosition: IPricePosition
  couponData: ICouponType
  btnText: string
  isReceived: boolean
  /** large 类型的按钮 props (NutUI 3.x Button) */
  buttonProps: Partial<ButtonProps>
  /** 已领取时右上角的标记 */
  usedIcon: ReactNode
  onBtnClick: (couponData: ICouponType) => void
}

export const Coupon: FunctionComponent<Partial<CouponProps>> = ({
  className,
  style,
  type = 'large',
  couponStyle,
  couponMainStyle,
  pricePosition = 'back',
  couponData,
  btnText,
  isReceived = false,
  buttonProps,
  usedIcon,
  onBtnClick,
}) => {
  const { locale } = useConfig()
  const b = bem('coupon')
  const text = btnText ?? locale.coupon.btnText

  const handleClick = () => {
    if (couponData) onBtnClick?.(couponData)
  }

  const number = (
    <View className={b('main-price-number')}>
      {couponData ? formatCouponPrice(couponData.price) : ''}
    </View>
  )
  const currency = <View className={b('main-price-currency')}>{couponData?.currency}</View>

  return (
    <View className={classNames(b(), className)} style={style}>
      <View className={b('box', { small: type === 'small' })} style={couponStyle}>
        <View className={b('main')} style={couponMainStyle}>
          <View className={b('main-price')}>
            {pricePosition === 'front' ? (
              <>
                {number}
                {currency}
              </>
            ) : (
              <>
                {currency}
                {number}
              </>
            )}
          </View>
          <View className={b('main-content')}>
            <View className={b('main-maintitle')}>{couponData?.mainTitle}</View>
            <View className={b('main-subtitle')}>{couponData?.subTitle}</View>
            {couponData?.timeRange ? (
              <View className={b('main-timerange')}>{couponData.timeRange}</View>
            ) : null}
          </View>
          {isReceived && usedIcon ? <View className={b('main-usedicon')}>{usedIcon}</View> : null}
        </View>
        <View className={b('btns')}>
          {type === 'small' ? (
            <View className={b('btns-vertical')} onClick={handleClick}>
              {text}
            </View>
          ) : (
            <Button {...buttonProps} disabled={isReceived} onClick={handleClick}>
              {text}
            </Button>
          )}
        </View>
        {couponData?.label ? <View className={b('label')}>{couponData.label}</View> : null}
      </View>
    </View>
  )
}

Coupon.displayName = 'NbCoupon'
