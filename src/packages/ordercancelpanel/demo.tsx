import { useState } from 'react'
import { View } from '@tarojs/components'
import { Cell, Toast } from '@nutui/nutui-react-taro'
import type { ButtonProps, TextAreaProps } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'
import { OrderCancelPanel } from './index'
import type { IreasonsObject } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const warmTips = [
  '1. 限时特价、预约资格等购买优惠可能一并取消',
  '2. 如遇订单拆分，京券将换成同价值京豆返还',
  '3. 支付券不予返还；支付优惠一并取消',
  '4. 订单一旦取消，无法恢复',
]

const cancelReason: IreasonsObject[] = [
  { key: 'reasons1', value: '商品无货' },
  { key: 'reasons2', value: '发货时间问题' },
  { key: 'reasons3', value: '不想要了' },
  { key: 'reasons4', value: '商品选错/多选' },
  { key: 'reasons5', value: '地址信息填写错误' },
  { key: 'reasons6', value: '商品降价' },
]

const otherReasonList: IreasonsObject[] = [...cancelReason, { key: 'other', value: '其它' }]

const buttonProps: Partial<ButtonProps> = { type: 'primary' }

const textAreaProps: Partial<TextAreaProps> = {
  placeholder: '请输入内容',
  maxLength: 100,
  showCount: true,
}

const popupTitle = '退款原因'
const reasonTitle = <View>请选择取消订单原因</View>

type PanelKey = 'basic' | 'tips' | 'other' | 'cancel' | 'front'

const OrderCancelPanelDemo = () => {
  const [open, setOpen] = useState<PanelKey | ''>('')
  const close = () => setOpen('')

  const submit = (reason: IreasonsObject, text: string, switchStatus: boolean) => {
    const content = `原因: ${reason ? reason.value : '未选择'}${text ? `, 补充: ${text}` : ''}, 放回购物车: ${switchStatus}`
    console.log(content)
    Toast.show('ordercancelpanel-toast', { content })
    close()
  }

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Cell title="显示弹窗" clickable onClick={() => setOpen('basic')} />
        <OrderCancelPanel
          showCancelPanel={open === 'basic'}
          popupTitle={popupTitle}
          cancelReason={cancelReason}
          buttonProps={buttonProps}
          onClose={close}
          onSubmitBtn={submit}
        />
      </DemoBlock>

      <DemoBlock title="带有温馨提示的组件">
        <Cell title="显示弹窗" clickable onClick={() => setOpen('tips')} />
        <OrderCancelPanel
          showCancelPanel={open === 'tips'}
          popupTitle={popupTitle}
          reasonTitle={reasonTitle}
          cancelReason={cancelReason}
          warmTips={warmTips}
          tipsTitle="温馨提示"
          submitText="确认"
          buttonProps={buttonProps}
          onClose={close}
          onSubmitBtn={submit}
        />
      </DemoBlock>

      <DemoBlock title="带有其它原因选项的组件">
        <Cell title="显示弹窗" clickable onClick={() => setOpen('other')} />
        <OrderCancelPanel
          showCancelPanel={open === 'other'}
          popupTitle={popupTitle}
          submitText="确认"
          cancelReason={otherReasonList}
          buttonProps={buttonProps}
          textAreaProps={textAreaProps}
          onClose={close}
          onSubmitBtn={submit}
        />
      </DemoBlock>

      <DemoBlock title="可取消已选中的原因">
        <Cell title="显示弹窗" clickable onClick={() => setOpen('cancel')} />
        <OrderCancelPanel
          showCancelPanel={open === 'cancel'}
          popupTitle={popupTitle}
          canCancelReason
          cancelReason={cancelReason}
          buttonProps={buttonProps}
          onClose={close}
          onSubmitBtn={submit}
        />
      </DemoBlock>

      <DemoBlock title="checkbox 选择框在前面">
        <Cell title="显示弹窗" clickable onClick={() => setOpen('front')} />
        <OrderCancelPanel
          showCancelPanel={open === 'front'}
          checkboxType="front"
          showBtntips
          popupTitle={popupTitle}
          cancelReason={cancelReason}
          buttonProps={buttonProps}
          onClose={close}
          onSubmitBtn={submit}
        />
      </DemoBlock>
      <Toast id="ordercancelpanel-toast" />
    </DemoPage>
  )
}

export default OrderCancelPanelDemo
