import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Cell } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import { Heart } from '@nutui/icons-react-taro'
import { GoodsFilter } from './index'
import type { GoodsFilterResult, GoodsFilterSelectData } from './index'
import data from './data'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const GoodsFilterDemo = () => {
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [visible3, setVisible3] = useState(false)
  const [visible4, setVisible4] = useState(false)
  const [address, setAddress] = useState('')
  const [showData, setShowData] = useState<GoodsFilterSelectData>({})
  const [log, setLog] = useState('')

  const onSave = (res: GoodsFilterResult) => {
    setShowData({ filterAttrs: res.filterAttrs, goodsAttrs: res.goodsAttrs, price: res.price })
    setLog(
      `已选: 筛选 ${res.filterAttrs.map((a) => a.name).join('/') || '-'}; 价格 ${res.price.low || '-'}~${res.price.high || '-'}; 属性 ${res.goodsAttrs
        .map((g) => g.values.length)
        .reduce((a, n) => a + n, 0)} 项`
    )
    setVisible4(false)
  }

  const common = {
    priceRanges: data.priceRanges,
    goodsAttrs: data.goodsAttrs,
    filterAttrs: data.filterAttrs,
  }

  return (
    <DemoPage>
      <DemoBlock title="基础用法">
        <Cell className="goodsfilter-demo-open1" title="点击进行商品筛选" onClick={() => setVisible1(true)} />
        <GoodsFilter {...common} visible={visible1} onClose={() => setVisible1(false)} />
      </DemoBlock>

      <DemoBlock title="自定义图标">
        <Cell title="点击进行商品筛选" onClick={() => setVisible2(true)} />
        <GoodsFilter
          {...common}
          visible={visible2}
          icon={<Heart size={12} />}
          onClose={() => setVisible2(false)}
        />
      </DemoBlock>

      <DemoBlock title="设置默认展示行数">
        <Cell title="点击进行商品筛选" onClick={() => setVisible3(true)} />
        <GoodsFilter
          {...common}
          visible={visible3}
          maxLine={3}
          onClose={() => setVisible3(false)}
        />
      </DemoBlock>

      <DemoBlock title="点击事件与回显">
        <Cell
          className="goodsfilter-demo-open4"
          title="点击进行商品筛选"
          onClick={() => setVisible4(true)}
        />
        <GoodsFilter
          {...common}
          visible={visible4}
          selectData={showData}
          selectedAddress={address}
          onClose={() => setVisible4(false)}
          onReset={() => setLog('onReset')}
          onConfirm={onSave}
          onClickAddress={() => setAddress('北京市朝阳区')}
          onSelectedAttrs={(attr, selected) =>
            setLog(`onSelectedAttrs: ${attr.name} ${selected ? '选中' : '取消'}`)
          }
          onSelectedPrice={(range) => setLog(`onSelectedPrice: ${range.low}-${range.high}`)}
          onSelectedGoodsAttr={(attrs, value) =>
            setLog(`onSelectedGoodsAttr: ${attrs.title} ${value.name}`)
          }
        />
        <View style={{ padding: '8px 16px 12px' }}>
          <Text className="goodsfilter-demo-log" style={{ fontSize: '12px', color: '#999' }}>
            {log || '选择后点击"确定", 再次打开会回显'}
          </Text>
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default GoodsFilterDemo
