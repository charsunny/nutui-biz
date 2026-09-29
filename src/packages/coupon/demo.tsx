import { useState } from 'react'
import type { CSSProperties } from 'react'
import { View, Image, ScrollView } from '@tarojs/components'
import type { ButtonProps } from '@nutui/nutui-react-taro'
import { Coupon } from './index'
import type { ICouponType } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const buttonProps: Partial<ButtonProps> = {
  type: 'primary',
  size: 'small',
  fill: 'outline',
  className: 'cancel-btn',
}

const usedIcon = (
  <Image
    style={{ width: '45px', height: '42px' }}
    src="https://storage.360buyimg.com/jdcdkh/open/1.0.0/assets/use-mask.60dc7c10.png"
  />
)

const baseCoupon: ICouponType = {
  price: '9.212',
  currency: '¥',
  mainTitle: '满100元可用',
  subTitle: '仅可购买满折券测试',
  label: <View style={{ color: '#ff0f23' }}>内购专享</View>,
  timeRange: '2022.03.01-2022.04.01',
}

const couponBaseStyle: CSSProperties = {
  width: '100%',
  height: 'auto',
  backgroundImage:
    'url(https://storage.360buyimg.com/jdcdkh/open/1.0.0/assets/bg-coupon-red.f6ae2e19.png)',
}
const couponMainBaseStyle: CSSProperties = { width: '69%', color: '#fff' }

const couponSmallStyle: CSSProperties = {
  width: '127px',
  height: 'auto',
  backgroundImage:
    'url(https://static.360buyimg.com/jdcdkh/open/1.0.0/assets/bg-coupon.6df5b4ed.png)',
  marginRight: '10px',
  marginBottom: '10px',
}
const couponMainSmallStyle: CSSProperties = { width: '80%', color: '#ff0f23' }

const smallCoupon: ICouponType = {
  price: 9,
  currency: '¥',
  mainTitle: '满100元可用',
  subTitle: '仅可购买满折券测试',
  label: '618',
}

const CouponDemo = () => {
  const [received, setReceived] = useState(false)
  const [receivedList, setReceivedList] = useState<number[]>([])

  return (
    <DemoPage>
      <DemoBlock title="基本用法" plain>
        <Coupon
          pricePosition="back"
          couponStyle={couponBaseStyle}
          couponMainStyle={couponMainBaseStyle}
          couponData={baseCoupon}
          btnText={received ? '已领取' : '立即领取'}
          isReceived={received}
          usedIcon={usedIcon}
          buttonProps={buttonProps}
          onBtnClick={() => setReceived(true)}
        />
      </DemoBlock>
      <DemoBlock title="小卡片类型的优惠券 (多行, 在外层元素上设置布局)" plain>
        <ScrollView scrollX style={{ width: '100%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '700px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
              const isReceived = receivedList.includes(item)
              return (
                <Coupon
                  key={item}
                  type="small"
                  pricePosition="front"
                  usedIcon={usedIcon}
                  isReceived={isReceived}
                  couponStyle={couponSmallStyle}
                  couponMainStyle={couponMainSmallStyle}
                  couponData={{ ...smallCoupon, item }}
                  btnText={isReceived ? '已领取' : '立即领取'}
                  onBtnClick={(data) => {
                    console.log('领取', data)
                    if (!receivedList.includes(data.item)) {
                      setReceivedList([...receivedList, data.item])
                    }
                  }}
                />
              )
            })}
          </View>
        </ScrollView>
      </DemoBlock>
    </DemoPage>
  )
}

export default CouponDemo
