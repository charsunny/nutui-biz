import type { CSSProperties } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Card } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const imgUrl =
  'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg'
const title =
  '【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水'
const shopName = '阳澄湖大闸蟹自营店'

const wordStyle: CSSProperties = {
  padding: '0 5px',
  fontSize: '10px',
  lineHeight: '15px',
  color: '#999',
  backgroundColor: '#f2f2f7',
  marginRight: '5px',
  marginTop: '3px',
}

const CardDemo = () => {
  const base = { imageProps: { src: imgUrl }, title, price: '388', shopName }
  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Card {...base} />
      </DemoBlock>
      <DemoBlock title="自定义商品标签">
        <Card
          {...base}
          prolistTpl={
            <View style={{ display: 'flex', flexWrap: 'wrap' }}>
              {['活鲜', '礼盒', '国产'].map((item) => (
                <Text style={wordStyle} key={item}>
                  {item}
                </Text>
              ))}
            </View>
          }
        />
      </DemoBlock>
      <DemoBlock title="价格后自定义标签">
        <Card
          {...base}
          priceAfterTpl={
            <Image
              style={{ width: '29px', height: '14px' }}
              src="https://img11.360buyimg.com/jdphoto/s58x28_jfs/t9451/359/415622649/15318/b0943e5d/59a78495N3bd2a9f8.png"
            />
          }
        />
      </DemoBlock>
      <DemoBlock title="自定义店铺介绍">
        <Card {...base} productTagsTpl={<View style={{ fontSize: '12px', color: '#999' }}>自定义店铺介绍</View>} />
      </DemoBlock>
      <DemoBlock title="自定义底部内容">
        <Card
          {...base}
          bottomTpl={
            <View style={{ fontSize: '12px', padding: '15px 0', textAlign: 'center' }}>
              自定义促销信息等
            </View>
          }
        />
      </DemoBlock>
      <DemoBlock title="半行模式" plain>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Card {...base} showType="half-line" />
          <Card {...base} showType="half-line" />
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default CardDemo
