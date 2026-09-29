import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@nutui/nutui-react-taro'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'

export interface SkuGoods {
  price: number | string
  imagePath: string
  skuId: string | number
}

export interface SkuHeaderProps extends IComponent {
  goods: Partial<SkuGoods>
  skuHeaderPrice: ReactNode
  skuHeaderExtra: ReactNode
}

export const SkuHeader: FunctionComponent<Partial<SkuHeaderProps>> = ({
  goods,
  skuHeaderPrice,
  skuHeaderExtra,
}) => {
  const { locale } = useConfig()
  const b = bem('sku')
  const { price = 0, imagePath = '', skuId = '' } = goods || {}

  const renderExtra = () => {
    if (skuHeaderExtra) return skuHeaderExtra
    if (skuId === '' || skuId === undefined || skuId === null) return null
    return (
      <Text className={b('header-extra')}>
        {locale.skuheader.skuId}
        {locale.skuheader.colon}
        {skuId}
      </Text>
    )
  }

  return (
    <View className={b('header')}>
      {imagePath ? (
        <Image className={b('header-image')} src={imagePath} mode="aspectFill" />
      ) : (
        <View className={b('header-image')} />
      )}
      <View className={b('header-right')}>
        {skuHeaderPrice || <Price price={price} symbol="¥" thousands={false} size="large" />}
        {renderExtra()}
      </View>
    </View>
  )
}

SkuHeader.displayName = 'NbSkuHeader'
