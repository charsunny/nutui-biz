import { Button, Toast } from '@nutui/nutui-react-taro'
import { InvoiceTitleList } from './index'
import type { InvoiceTitleListData } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const TOAST_ID = 'nb-demo-invoice-title-list-toast'
const toast = (content: string) => Toast.show(TOAST_ID, { content })

const base: InvoiceTitleListData = {
  isSelected: false,
  type: 'normal',
  isShowDefault: false,
  title: '北京环球影城娱乐信息技术有限公司',
  companyCode: '91110302MA222LU88A',
  address: '北京市通州区台湖镇',
  companyPhone: '88488848',
  bankDeposit: '中国银行股份有限公司北京分行',
  bankAccount: '5833 2153 4243 2654',
  isDelete: true,
  isEdit: true,
}

const handlers = {
  onClick: (data: InvoiceTitleListData) => {
    toast('触发点击事件')
    console.log('data', data)
  },
  onEdit: (data: InvoiceTitleListData) => {
    toast('触发编辑事件')
    console.log('data', data)
  },
  onDelete: (data: InvoiceTitleListData) => {
    toast('触发删除事件')
    console.log('data', data)
  },
}

const InvoiceTitleListDemo = () => {
  return (
    <DemoPage>
      <DemoBlock title="增值税专用发票" plain>
        <InvoiceTitleList data={{ ...base, type: 'special', status: 'pass' }} {...handlers} />
        <InvoiceTitleList data={{ ...base, type: 'special', status: 'approval' }} {...handlers} />
        <InvoiceTitleList data={{ ...base, type: 'special', status: 'veto' }} {...handlers} />
      </DemoBlock>
      <DemoBlock title="电子普通发票" plain>
        <InvoiceTitleList data={base} {...handlers} />
      </DemoBlock>
      <DemoBlock title="是否默认" plain>
        <InvoiceTitleList data={{ ...base, isShowDefault: true }} {...handlers} />
      </DemoBlock>
      <DemoBlock title="是否选中" plain>
        <InvoiceTitleList data={{ ...base, isSelected: true }} {...handlers} />
      </DemoBlock>
      <DemoBlock title="操作按钮自定义" plain>
        <InvoiceTitleList
          data={base}
          {...handlers}
          otherOperate={
            <Button size="small" onClick={() => toast('同步成功')}>
              同步到电子发票
            </Button>
          }
        />
      </DemoBlock>
      <DemoBlock title="隐藏所有操作" plain>
        <InvoiceTitleList data={{ ...base, isDelete: false, isEdit: false }} onClick={handlers.onClick} />
      </DemoBlock>
      <Toast id={TOAST_ID} />
    </DemoPage>
  )
}

export default InvoiceTitleListDemo
