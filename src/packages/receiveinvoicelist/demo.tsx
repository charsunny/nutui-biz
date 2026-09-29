import { Toast } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'
import { ReceiveInvoiceList } from './index'
import type { ReceiveInvoiceItem } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const TOAST_ID = 'receiveinvoicelist-demo-toast'

const list: ReceiveInvoiceItem[] = [
  {
    id: 1,
    name: '张三',
    tel: '15088888888',
    addres: '北京市大兴京东大厦1号楼',
    isDefault: true,
  },
  {
    id: 2,
    name: '李四',
    tel: '15088888888',
    addres: '北京市大兴京东大厦2号楼',
    isDefault: false,
    extends: [
      { label: '扩展1', value: '扩展信息展示' },
      { label: '扩展2', value: '扩展信息展示' },
    ],
  },
]

const toast = (name: string) => (item: ReceiveInvoiceItem, index: number) => {
  console.log(name, item, index)
  Toast.show(TOAST_ID, { content: `${name} ${item.name}` })
}

const ReceiveInvoiceListDemo = () => (
  <DemoPage>
    <DemoBlock title="基本用法" plain>
      <ReceiveInvoiceList
        list={list}
        defaultValue={1}
        onSelected={toast('onSelected')}
        onEdit={toast('onEdit')}
      />
    </DemoBlock>
    <DemoBlock title="使用左滑删除" plain>
      <ReceiveInvoiceList
        enableDelete
        list={list}
        defaultValue={1}
        onSelected={toast('onSelected')}
        onEdit={toast('onEdit')}
        onDelete={toast('onDelete')}
      />
    </DemoBlock>
    <Toast id={TOAST_ID} />
  </DemoPage>
)

export default ReceiveInvoiceListDemo
