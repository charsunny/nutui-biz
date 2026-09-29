import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Category } from './index'
import type { CategoryData, CategoryPaneItem } from './index'
import { categoryInfo } from './data'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const category = categoryInfo as CategoryData[]
const boxStyle = { height: '480px' }

const CategoryDemo = () => {
  const [log, setLog] = useState('')

  const onChange = (item: CategoryData) => setLog(`一级分类: ${item.catName}`)
  const onPanelThirdClick = (sku: CategoryPaneItem) => setLog(`三级分类: ${sku.catName}`)
  const onPanelNavClick = (index: number) => setLog(`快捷导航: ${index}`)

  return (
    <DemoPage>
      <View style={{ padding: '8px 12px 0', minHeight: '20px' }}>
        <Text className="category-demo-log" style={{ fontSize: '12px', color: '#999' }}>
          {log}
        </Text>
      </View>
      <DemoBlock title="经典用法">
        <View style={boxStyle} className="category-demo-basic">
          <Category
            category={category}
            isLazy={false}
            showPullUp
            onChange={onChange}
            onPanelThirdClick={onPanelThirdClick}
          />
        </View>
      </DemoBlock>
      <DemoBlock title="隐藏图片">
        <View style={boxStyle} className="category-demo-noimg">
          <Category category={category} showSkuImg={false} onPanelThirdClick={onPanelThirdClick} />
        </View>
      </DemoBlock>
      <DemoBlock title="横向快捷导航">
        <View style={boxStyle} className="category-demo-quick">
          <Category
            category={category}
            showSecondLevelQuickNav
            onPanelNavClick={onPanelNavClick}
            onPanelThirdClick={onPanelThirdClick}
          />
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default CategoryDemo
