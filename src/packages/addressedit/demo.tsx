import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Input, Radio } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/radio/style/css'
import { AddressEdit } from './index'
import type { AddressData, AddressInfo, AddressResult } from './index'
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

const addressData: AddressResult = {
  addressSelect: [],
  addressTitle: '选择所在地区',
  province,
  city,
  country,
  town: [],
  type: 'custom',
}

const addressData2: AddressResult = {
  addressSelect: [1, 7, 3],
  addressTitle: '选择所在地区',
  province,
  city,
  country,
  town: [],
  type: 'elevator',
  height: '270px',
}

const addressInfo: AddressInfo = {
  name: '',
  tel: '',
  region: '',
  regionIds: [],
  address: '',
  default: false,
}

const addressInfo2: AddressInfo = {
  name: '张三',
  tel: '13141234567',
  region: '北京朝阳区八里庄街道',
  regionIds: [1, 7, 3],
  address: 'xxx小区3-2-302',
  default: true,
}

const addressSetData: Partial<AddressData> = {
  isRequired: ['name', 'tel', 'region', 'address'],
}

const addressSetData2: Partial<AddressData> = {
  nameText: '收件人',
  namePlaceholder: '请输入收件人姓名',
  isRequired: ['name', 'tel'],
  errorShowType: 'toast',
}

const CustomInput = ({ label }: { label: string }) => (
  <View className="nb-addressedit__item">
    <View className="nb-addressedit__row">
      <View className="nb-addressedit__label">
        <Text>{label}</Text>
      </View>
      <Input
        className="nb-addressedit__input"
        plain
        placeholder="请输入"
        clearable
        onChange={(v) => console.log(label, v)}
      />
    </View>
  </View>
)

const scenes = [
  { value: '1', label: '新增地址' },
  { value: '2', label: '修改地址' },
  { value: '3', label: '隐藏保存按钮' },
  { value: '4', label: '自定义输入框' },
]

const AddressEditDemo = () => {
  const [scene, setScene] = useState<string>('1')

  return (
    <DemoPage>
      <DemoBlock title="切换示例">
        <View style={{ padding: '12px' }}>
          <Radio.Group
            value={scene}
            direction="horizontal"
            style={{ flexWrap: 'wrap' }}
            onChange={(v) => setScene(String(v))}
          >
            {scenes.map((s) => (
              <Radio key={s.value} value={s.value} style={{ marginBottom: '6px' }}>
                {s.label}
              </Radio>
            ))}
          </Radio.Group>
        </View>
      </DemoBlock>

      {scene === '1' && (
        <DemoBlock title="新增地址">
          <AddressEdit
            address={addressData}
            data={addressSetData}
            addressInfo={addressInfo}
            onSave={(formData) => console.log('save', formData)}
          />
        </DemoBlock>
      )}

      {scene === '2' && (
        <DemoBlock title="修改地址">
          <AddressEdit
            address={addressData2}
            data={addressSetData}
            addressInfo={addressInfo2}
            onSave={(formData) => console.log('save', formData)}
            onChangeAddress={(cal) => console.log('onChangeAddress', cal)}
            onCloseAddress={(val) => console.log('onCloseAddress', val)}
          />
        </DemoBlock>
      )}

      {scene === '3' && (
        <DemoBlock title="隐藏保存按钮">
          <AddressEdit
            address={addressData2}
            data={addressSetData2}
            addressInfo={addressInfo2}
            showSave={false}
            onSwitch={(state, data) => console.log('switch', state, data)}
            onChange={(value, tag) => console.log(tag, value)}
            onCloseAddress={(val) => console.log('onCloseAddress', val)}
          />
        </DemoBlock>
      )}

      {scene === '4' && (
        <DemoBlock title="自定义输入框">
          <AddressEdit
            address={addressData}
            data={addressSetData2}
            addressInfo={addressInfo}
            onChange={(value, tag) => console.log(tag, value)}
            onSave={(formData) => console.log('save', formData)}
            bottomInputTpl={
              <>
                <CustomInput label="自定义内容1" />
                <CustomInput label="自定义内容2" />
              </>
            }
          />
        </DemoBlock>
      )}
    </DemoPage>
  )
}

export default AddressEditDemo
