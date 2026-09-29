import { View } from '@tarojs/components'
import { Toast } from '@nutui/nutui-react-taro'
import { InvoiceTitleEdit } from './index'
import type { InvoiceTitleEditData } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const TOAST_ID = 'nb-demo-invoice-title-edit-toast'

const handleSubmit = (arg: any) => {
  if (Array.isArray(arg)) {
    console.log('failed error', arg)
    Toast.show(TOAST_ID, { content: '请完善必填项', icon: 'fail' })
  } else {
    console.log('succeed', arg)
    Toast.show(TOAST_ID, { content: '提交成功', icon: 'success' })
  }
}

const specialData: InvoiceTitleEditData = {
  title: '京东集团',
  companyCode: '123456ABCD',
  address: '北京市经开区',
  companyPhone: '010-12345678',
  bankDeposit: '中国银行',
  bankAccount: '12345678',
}

const normalData: InvoiceTitleEditData = { ...specialData, titleType: 'enterprise' }

const InvoiceTitleEditDemo = () => {
  return (
    <DemoPage>
      <DemoBlock title="增值税专用发票">
        <InvoiceTitleEdit
          className="demo-invoice-special"
          data={specialData}
          submitFixed={false}
          onSubmit={handleSubmit}
          onInput={(val) => console.log('发票抬头输入', val)}
        />
      </DemoBlock>
      <DemoBlock title="电子普通发票">
        <InvoiceTitleEdit
          data={normalData}
          invoiceType="normal"
          submitButtonText="提交"
          submitFixed={false}
          onSubmit={handleSubmit}
        />
      </DemoBlock>
      <DemoBlock title="自定义底部 (提交按钮固定在页面底部)">
        <InvoiceTitleEdit
          className="demo-invoice-empty"
          invoiceType="normal"
          submitButtonText="提交"
          onSubmit={handleSubmit}
          bottom={<View style={{ textAlign: 'center', lineHeight: '40px', fontSize: '14px' }}>自定义底部</View>}
        />
      </DemoBlock>
      <Toast id={TOAST_ID} />
    </DemoPage>
  )
}

export default InvoiceTitleEditDemo
