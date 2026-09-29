import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { QuickEnter } from './index'
import type { QuickEnterData } from './index'
import { quickEnterData } from './data'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const basicData = quickEnterData.slice(0, 10)

const QuickEnterDemo = () => {
  const [clicked, setClicked] = useState('')
  const onClickItem = (item: QuickEnterData) => setClicked(item.displayName)

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <QuickEnter data={basicData} onClickItem={onClickItem} />
      </DemoBlock>
      <DemoBlock title="轮播展示">
        <QuickEnter data={quickEnterData} indicatorVisible onClickItem={onClickItem} />
      </DemoBlock>
      <DemoBlock title="单行">
        <QuickEnter data={quickEnterData} rows={1} indicatorVisible onClickItem={onClickItem} />
      </DemoBlock>
      <DemoBlock title="滑动展示">
        <View className="quickenter-demo-slide">
          <QuickEnter slideMode="slide" data={quickEnterData} rows={2} onClickItem={onClickItem} />
        </View>
      </DemoBlock>
      <DemoBlock title="自定义列数、图标大小与指示器颜色">
        <QuickEnter
          data={quickEnterData}
          columns={4}
          rows={1}
          iconSize={[40, 40]}
          indicatorVisible
          indicatorBgColor="#ddd"
          indicatorActiveColor="#0073ff"
          onClickItem={onClickItem}
        />
      </DemoBlock>
      <View style={{ padding: '0 12px' }}>
        <Text style={{ fontSize: '12px', color: '#999' }}>
          {clicked ? `点击了: ${clicked}` : '点击任一图标'}
        </Text>
      </View>
    </DemoPage>
  )
}

export default QuickEnterDemo
