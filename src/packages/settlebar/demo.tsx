import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Toast } from '@nutui/nutui-react-taro'
import { SettleBar } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'

const toast = (content: string) => Toast.show('settlebar-demo', { content })

const SettleBarDemo = () => {
  const [checkedAll, setCheckedAll] = useState(false)
  const [fixedCheckedAll, setFixedCheckedAll] = useState(true)

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <SettleBar
          fixed={false}
          total={checkedAll ? 100 : 0}
          settleCount={checkedAll ? 2 : 0}
          isCheckedAll={checkedAll}
          onSelectAll={(checked) => setCheckedAll(checked)}
          onClickButton={() => toast('点击按钮')}
        />
      </DemoBlock>
      <DemoBlock title="对齐方式">
        <SettleBar
          fixed={false}
          total={100}
          totalAlign="left"
          onClickButton={() => toast('点击按钮')}
        />
      </DemoBlock>
      <DemoBlock title="禁用状态">
        <SettleBar fixed={false} total={100} disabled />
      </DemoBlock>
      <DemoBlock title="加载状态">
        <SettleBar fixed={false} total={100} loading />
      </DemoBlock>
      <DemoBlock title="提交订单">
        <SettleBar
          fixed={false}
          total={100}
          customSelectAll=""
          noCount
          totalText="总计"
          settleButtonText="提交订单"
          onClickButton={() => toast('提交订单')}
        />
      </DemoBlock>
      <DemoBlock title="去结算数量">
        <SettleBar
          fixed={false}
          total={100}
          settleCount="100"
          onClickButton={() => toast('点击按钮')}
        />
      </DemoBlock>
      <DemoBlock title="自定义合计额外区域内容">
        <SettleBar
          fixed={false}
          total={100}
          customTotalExtra={
            <Text style={{ fontSize: '12px', color: '#888b94' }}>已减 ¥30.00</Text>
          }
          onClickButton={() => toast('点击按钮')}
        />
      </DemoBlock>
      <DemoBlock title="带有警告信息">
        <SettleBar
          fixed={false}
          total={100}
          customWarning={
            <View
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: '12px', color: '#ff8200' }}>此商品无货！</Text>
            </View>
          }
          onClickButton={() => toast('点击按钮')}
        />
      </DemoBlock>
      <DemoBlock title="固定在底部 (带占位)">
        <View style={{ padding: '12px', fontSize: '12px', color: '#888b94' }}>
          默认固定在页面底部, placeholder 会在原位置生成等高占位。
        </View>
      </DemoBlock>
      <SettleBar
        placeholder
        total={fixedCheckedAll ? 299 : 0}
        settleCount={fixedCheckedAll ? 3 : 0}
        showZero={false}
        isCheckedAll={fixedCheckedAll}
        onSelectAll={(checked) => setFixedCheckedAll(checked)}
        onClickButton={() => toast('去结算')}
      />
      <Toast id="settlebar-demo" />
    </DemoPage>
  )
}

export default SettleBarDemo
