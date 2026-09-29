import { AddressList } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const data = [
  {
    id: 3,
    addressName: '张三',
    phone: '123****4567',
    defaultAddress: false,
    fullAddress: '北京亦庄经济技术开发区科创十一街18号院',
  },
  {
    id: 4,
    addressName: '李四',
    phone: '123****4567',
    defaultAddress: true,
    fullAddress: '北京亦庄经济技术开发区科创十一街18号院',
  },
]

// 字段名与 IDataInfo 不同, 用 dataMapOptions 映射
const customData = [
  {
    testid: 5,
    testaddressName: '王五',
    phone: '123****4567',
    defaultAddress: false,
    testaddressDetail: '北京大兴区京东大厦',
  },
  {
    testid: 6,
    testaddressName: '赵六',
    phone: '123****4567',
    defaultAddress: true,
    testaddressDetail: '北京大兴区京东总部2号楼',
  },
]

const dataMapOptions = {
  id: 'testid',
  addressName: 'testaddressName',
  fullAddress: 'testaddressDetail',
}

const log = (name: string) => (_event: unknown, item?: unknown) => console.log(name, item)

const AddressListDemo = () => (
  <DemoPage>
    <DemoBlock title="基本用法">
      <AddressList
        data={data}
        showBottomButton={false}
        onDelIcon={log('delete')}
        onEditIcon={log('edit')}
        onItemClick={log('click')}
      />
    </DemoBlock>
    <DemoBlock title="自定义字段映射">
      <AddressList
        data={customData}
        dataMapOptions={dataMapOptions}
        showBottomButton={false}
        onDelIcon={log('delete')}
        onEditIcon={log('edit')}
        onItemClick={log('click')}
      />
    </DemoBlock>
    <DemoBlock title="长按功能">
      <AddressList
        data={data}
        longPress
        showBottomButton={false}
        onDelIcon={log('delete')}
        onEditIcon={log('edit')}
        onItemClick={log('click')}
        onLongCopy={log('copy')}
        onLongSet={log('set default')}
        onLongDel={log('long delete')}
      />
    </DemoBlock>
    <DemoBlock title="滑动功能">
      <AddressList
        data={data}
        swipeEdition
        showBottomButton
        onDelIcon={log('delete')}
        onEditIcon={log('edit')}
        onItemClick={log('click')}
        onAdd={log('add')}
        onSwipeDel={log('swipe delete')}
      />
    </DemoBlock>
  </DemoPage>
)

export default AddressListDemo
