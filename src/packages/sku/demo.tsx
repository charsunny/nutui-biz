import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Cell, Price, Toast } from '@nutui/nutui-react-taro'
import { Sku, getSelectedSkuItems, resolveSkuAvailability, selectSkuItem } from './index'
import type { SkuGoods, SkuOperateInfo, SkuSelectInfo, SkuSpec } from './index'
import { demoCombos, demoGoods, demoImagePathMap, demoSku } from './demo-data'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'
import '@nutui/nutui-react-taro/dist/es/packages/button/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'

const toast = (content: string) => Toast.show('sku-demo', { content })

const operateBoxStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  padding: '8px 10px',
  boxSizing: 'border-box',
}

const addresses = ['北京市石景山区城区', '北京市朝阳区八里庄街道', '上海市浦东新区张江镇']

/** 选中规格后同步商品信息 (图片取颜色对应的图) */
const goodsFromSku = (sku: SkuSpec[], prev: SkuGoods): SkuGoods => {
  const [color, ...rest] = getSelectedSkuItems(sku)
  const last = [...rest].reverse().find(Boolean) || color
  return {
    ...prev,
    skuId: String(last?.id ?? prev.skuId),
    imagePath: (color && demoImagePathMap[String(color.id)]) || prev.imagePath,
  }
}

const SkuDemo = () => {
  const [base, setBase] = useState(false)
  const [notSell, setNotSell] = useState(false)
  const [customStepper, setCustomStepper] = useState(false)
  const [customByContent, setCustomByContent] = useState(false)
  const [linkage, setLinkage] = useState(false)

  const [skuData, setSkuData] = useState<SkuSpec[]>(demoSku)
  const [goodsInfo, setGoodsInfo] = useState<SkuGoods>(demoGoods)
  // 规格联动示例从「未选择」开始, 置灰状态完全由可售组合计算
  const [linkageSku, setLinkageSku] = useState<SkuSpec[]>(() =>
    resolveSkuAvailability(
      demoSku.map((spec) => ({ ...spec, list: spec.list.map((item) => ({ ...item, active: false })) })),
      demoCombos
    )
  )
  const [minCount, setMinCount] = useState(2)
  const [addressIndex, setAddressIndex] = useState(0)

  const selectSku = ({ sku, parentIndex }: SkuSelectInfo) => {
    const next = selectSkuItem(skuData, parentIndex, sku.id)
    setSkuData(next)
    setGoodsInfo((prev) => goodsFromSku(next, prev))
  }

  const selectLinkageSku = ({ sku, parentIndex }: SkuSelectInfo) => {
    setLinkageSku((prev) => resolveSkuAvailability(selectSkuItem(prev, parentIndex, sku.id), demoCombos))
  }

  const linkageDesc = useMemo(
    () =>
      getSelectedSkuItems(linkageSku)
        .map((item) => item?.name ?? '未选')
        .join(' / '),
    [linkageSku]
  )

  const clickBtnOperate = ({ type, value }: SkuOperateInfo) => {
    toast(`点击了 ${type}, 数量 ${value}`)
  }

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Cell title="基本用法" clickable onClick={() => setBase(true)} />
      </DemoBlock>
      <Sku
        visible={base}
        sku={skuData}
        goods={goodsInfo}
        onSelectSku={selectSku}
        onClickBtnOperate={clickBtnOperate}
        onClose={() => setBase(false)}
      />

      <DemoBlock title="不可售">
        <Cell title="不可售" clickable onClick={() => setNotSell(true)} />
      </DemoBlock>
      <Sku
        visible={notSell}
        sku={skuData}
        goods={goodsInfo}
        btnExtraText="抱歉，此商品在所选区域暂无存货"
        onSelectSku={selectSku}
        operateBtn={
          <View style={operateBoxStyle}>
            <Button style={{ flex: 1, marginRight: '18px' }} type="warning" onClick={() => toast('查看相似商品')}>
              查看相似商品
            </Button>
            <Button style={{ flex: 1 }} type="info" onClick={() => toast('到货通知')}>
              到货通知
            </Button>
          </View>
        }
        onClose={() => setNotSell(false)}
      />

      <DemoBlock title="自定义计步器">
        <Cell title="自定义计步器" clickable onClick={() => setCustomStepper(true)} />
      </DemoBlock>
      <Sku
        visible={customStepper}
        sku={skuData}
        goods={goodsInfo}
        stepperMax={7}
        stepperMin={2}
        stepperExtraText={() => (
          <Text style={{ width: '100%', textAlign: 'right', color: '#ff0f23' }}>{minCount} 件起售</Text>
        )}
        onChangeStepper={(count) => setMinCount(count)}
        onOverLimit={() => toast('已到极限值')}
        btnOptions={['buy', 'cart']}
        onSelectSku={selectSku}
        onClickBtnOperate={clickBtnOperate}
        onClose={() => setCustomStepper(false)}
      />

      <DemoBlock title="自定义内容">
        <Cell title="自定义内容" clickable onClick={() => setCustomByContent(true)} />
      </DemoBlock>
      <Sku
        visible={customByContent}
        sku={skuData}
        goods={goodsInfo}
        btnOptions={['buy', 'cart']}
        skuHeaderPrice={
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Price price={goodsInfo.price} symbol="¥" thousands={false} size="large" />
            <Text
              style={{
                marginLeft: '8px',
                padding: '0 4px',
                fontSize: '10px',
                lineHeight: '16px',
                color: '#fff',
                background: '#ff0f23',
                borderRadius: '4px',
              }}
            >
              PLUS 价
            </Text>
          </View>
        }
        skuHeaderExtra={
          <Text style={{ fontSize: '12px', color: '#888b94' }}>
            重量：0.1kg 编号：{goodsInfo.skuId}
          </Text>
        }
        operateBtn={
          <View style={operateBoxStyle}>
            <Button
              style={{ flex: 1, borderRadius: '20px 0 0 20px' }}
              shape="square"
              type="warning"
              onClick={() => toast('加入购物车')}
            >
              加入购物车
            </Button>
            <Button
              style={{ flex: 1, borderRadius: '0 20px 20px 0' }}
              shape="square"
              type="primary"
              onClick={() => toast('立即购买')}
            >
              立即购买
            </Button>
          </View>
        }
        skuSelectTop={
          <Cell
            style={{ padding: '13px 0', boxShadow: 'none' }}
            title="送至"
            extra={addresses[addressIndex]}
            clickable
            onClick={() => setAddressIndex((i) => (i + 1) % addresses.length)}
          />
        }
        onSelectSku={selectSku}
        onClose={() => setCustomByContent(false)}
      />

      <DemoBlock title="规格联动 (按可售组合置灰)">
        <Cell
          title="规格联动"
          description={linkageDesc}
          clickable
          onClick={() => setLinkage(true)}
        />
      </DemoBlock>
      <Sku
        visible={linkage}
        sku={linkageSku}
        goods={goodsFromSku(linkageSku, demoGoods)}
        btnOptions={['cart', 'buy']}
        skuStepperBottom={
          <View style={{ paddingBottom: '12px', fontSize: '12px', color: '#888b94' }}>
            已选：{linkageDesc}
          </View>
        }
        onSelectSku={selectLinkageSku}
        onClickBtnOperate={clickBtnOperate}
        onClose={() => setLinkage(false)}
      />
      <Toast id="sku-demo" />
    </DemoPage>
  )
}

export default SkuDemo
