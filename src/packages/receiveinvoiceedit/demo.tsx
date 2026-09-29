import { ReceiveInvoiceEdit } from './index'
import type { InvoiceAddressResult, InvoiceData, InvoiceInfo } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const province = [
  { id: 1, name: '北京', title: 'B' },
  { id: 2, name: '广西', title: 'G' },
  { id: 3, name: '江西', title: 'J' },
  { id: 4, name: '四川', title: 'S' },
  { id: 5, name: '浙江', title: 'Z' },
]
const city = [
  { id: 7, name: '朝阳区', title: 'C' },
  { id: 8, name: '崇文区', title: 'C' },
  { id: 9, name: '昌平区', title: 'C' },
  { id: 6, name: '石景山区', title: 'S' },
  { id: 3, name: '八里庄街道', title: 'B' },
  { id: 10, name: '北苑', title: 'B' },
]
const country = [
  { id: 3, name: '八里庄街道', title: 'B' },
  { id: 9, name: '北苑', title: 'B' },
  { id: 4, name: '常营乡', title: 'C' },
]

const addressData: InvoiceAddressResult = {
  addressSelect: [],
  addressTitle: '选择所在地区',
  province,
  city,
  country,
  town: [],
}

const addressData2: InvoiceAddressResult = { ...addressData, addressSelect: [1, 7, 3] }

const invoiceInfo: InvoiceInfo = {
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
}

const invoiceInfo2: InvoiceInfo = {
  name: 'xx',
  tel: '12345678913',
  region: '北京朝阳区八里庄街道',
  regionIds: [1, 7, 3],
  address: 'xxx小区3-2-302',
}

const setData: InvoiceData = {
  required: ['name', 'tel'],
}

const ReceiveInvoiceEditDemo = () => (
  <DemoPage>
    <DemoBlock title="基本用法">
      <ReceiveInvoiceEdit
        address={addressData}
        data={setData}
        invoiceInfo={invoiceInfo}
        onSave={(formData) => console.log('save', formData)}
      />
    </DemoBlock>
    <DemoBlock title="修改地址">
      <ReceiveInvoiceEdit
        address={addressData2}
        data={setData}
        invoiceInfo={invoiceInfo2}
        onSave={(formData) => console.log('save', formData)}
        onAddressChange={(cal) => console.log('onAddressChange', cal)}
        onAddressClose={(val) => console.log('onAddressClose', val)}
      />
    </DemoBlock>
  </DemoPage>
)

export default ReceiveInvoiceEditDemo
