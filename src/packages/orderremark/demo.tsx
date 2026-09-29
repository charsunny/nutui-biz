import { useState } from 'react'
import { Cell, Toast } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'
import { OrderRemark } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const TOAST_ID = 'orderremark-toast'
const toast = (content: string) => Toast.show(TOAST_ID, { content })

const tagArr = [
  '京东快递',
  '轻拿轻放',
  '周末配送',
  '配送前，需提前电话联系',
  '如家中无人，可电话后，放置于门口',
]

const emptyText = '请输入备注信息'

const OrderRemarkDemo = () => {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [mark, setMark] = useState('轻拿轻放')
  const [mark2, setMark2] = useState('')
  const [mark3, setMark3] = useState('')
  const [mark4, setMark4] = useState('')

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Cell title="订单备注" extra={mark || emptyText} clickable onClick={() => setShow(true)} />
        <OrderRemark
          visible={show}
          remark={mark}
          onClose={() => setShow(false)}
          onSubmit={(val) => setMark(val)}
        />
      </DemoBlock>

      <DemoBlock title="带有标签">
        <Cell title="订单备注" extra={mark2 || emptyText} clickable onClick={() => setShow2(true)} />
        <OrderRemark
          visible={show2}
          maxLength={100}
          remark={mark2}
          recommendTags={tagArr}
          onClose={() => setShow2(false)}
          onSubmit={(val) => setMark2(val)}
        />
      </DemoBlock>

      <DemoBlock title="自定义文案">
        <Cell title="订单备注" extra={mark3 || emptyText} clickable onClick={() => setShow3(true)} />
        <OrderRemark
          visible={show3}
          remark={mark3}
          recommendTags={tagArr}
          submitText="提交"
          placeholderText="请填写备注信息"
          title="备注信息"
          tagTitle="快捷选择"
          onClose={() => setShow3(false)}
          onSubmit={(val) => setMark3(val)}
        />
      </DemoBlock>

      <DemoBlock title="事件演示">
        <Cell title="订单备注" extra={mark4 || emptyText} clickable onClick={() => setShow4(true)} />
        <OrderRemark
          visible={show4}
          remark={mark4}
          recommendTags={tagArr}
          onOpen={() => toast('onOpen')}
          onClose={(val) => {
            console.log('onClose', val)
            setShow4(false)
          }}
          onClickOverlay={(val) => console.log('onClickOverlay', val)}
          onClickTag={(tag, index, str) => {
            console.log('onClickTag', tag, index, str)
            toast(`onClickTag: ${tag}`)
          }}
          onChange={(val) => console.log('onChange', val)}
          onSubmit={(val) => {
            toast(`onSubmit: ${val}`)
            setMark4(val)
          }}
        />
      </DemoBlock>
      <Toast id={TOAST_ID} />
    </DemoPage>
  )
}

export default OrderRemarkDemo
