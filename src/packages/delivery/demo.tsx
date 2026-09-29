import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Text, View } from '@tarojs/components'
import { Cell, Popup } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import { Delivery } from './index'
import type {
  DateTimeAccurateType,
  DateTimesType,
  DateTimeType,
  DateType,
  DeliveryData,
  DeliveryTypes,
} from './index'
import { DeliveryDate } from '../deliverydate'
import { DeliveryDateTime } from '../deliverydatetime'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

// ---- 演示数据 ----

const weekDates: DateType[] = [
  { label: '1', text: '2月28日(周二)' },
  { label: '2', text: '3月1日(周三)' },
  { label: '3', text: '3月2日(周四)' },
  { label: '4', text: '3月3日(周五)' },
  { label: '5', text: '3月4日(周六)' },
  { label: '6', text: '3月5日(周日)' },
  { label: '7', text: '3月6日(周一)' },
  { label: '8', text: '3月7日(周二)' },
  { label: '9', text: '3月8日(周三)' },
  { label: '10', text: '3月9日(周四)' },
]

const dateTimeData: DateTimeType[] = [
  {
    label: '1',
    title: '2月28日(周二)',
    children: [
      { label: '11', text: '09:00-15:00', selected: true },
      { label: '22', text: '15:00-18:00' },
    ],
  },
  {
    label: '2',
    title: '3月1日(周三)',
    children: [
      { label: '33', text: '09:00-15:00' },
      { label: '44', text: '16:00-18:00' },
    ],
  },
]

// 京准达时间段: label → [时间, 运费说明]
const slotInfo: Record<string, [string, string]> = {
  '333': ['09:00-10:00', '加收3元运费'],
  '444': ['10:00-11:00', '加收5元运费'],
  '555': ['15:00-18:00', '加收3元运费'],
  '666': ['12:00-14:00', '加收3元运费'],
  '777': ['16:00-17:00', '加收3元运费'],
  '888': ['19:00-21:00', '加收10元运费'],
}

const slot = (label: string, disabled?: boolean): DateType => ({
  label,
  disabled,
  text: (
    <View>
      <View style={{ lineHeight: '2' }}>{slotInfo[label][0]}</View>
      <View style={{ lineHeight: '1', fontSize: '12px' }}>{slotInfo[label][1]}</View>
    </View>
  ),
})

const accurateData: DateTimeAccurateType[] = [
  {
    label: '1',
    title: '3月1日(周三)',
    children: [
      { label: '11', title: '上午', children: [slot('333', true), slot('444')] },
      { label: '22', title: '晚间', children: [slot('555')] },
    ],
  },
  {
    label: '2',
    title: '3月2日(周四)',
    children: [
      { label: '22', title: '中午', children: [slot('666')] },
      { label: '23', title: '下午', children: [slot('777')] },
      { label: '24', title: '晚间', children: [slot('888')] },
    ],
  },
]

const deliveryTypes1: DeliveryTypes[] = [
  { label: 'jd', text: '京东快递', desc: '若社区村镇人员出入管控，京东快递可送货上门' },
  {
    label: 'jc',
    text: '无接触配送',
    desc: '无接触配送，自定义',
    children: (
      <View style={{ padding: '0 20px', fontSize: '12px' }}>可选择无接触配送点</View>
    ),
  },
]

// ---- 把回调里选中的时间写回数据的 selected 标记 (不可变更新) ----

const markDates = (list: DateType[], label?: string): DateType[] =>
  list.map((item) => ({ ...item, selected: item.label === label ? true : undefined }))

const markDateTime = (list: DateTimeType[], picked: DateTimeType): DateTimeType[] =>
  list.map((panel) => ({
    ...panel,
    children: markDates(
      panel.children,
      panel.label === picked.label ? picked.children[0]?.label : undefined
    ),
  }))

const markAccurate = (
  list: DateTimeAccurateType[],
  picked: DateTimeAccurateType
): DateTimeAccurateType[] =>
  list.map((panel) => ({
    ...panel,
    children: panel.children.map((group) => ({
      ...group,
      children: markDates(
        group.children,
        panel.label === picked.label && group.label === picked.children[0]?.label
          ? picked.children[0]?.children[0]?.label
          : undefined
      ),
    })),
  }))

const customStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '20px 20px 0',
  padding: '12px',
  fontSize: '14px',
  background: '#f7f8fa',
  borderRadius: '6px',
}

// 单独使用子组件时: Popup 纵向 flex, 子组件占满标题以下的空间
const popupStyle: CSSProperties = { height: '80%', display: 'flex', flexDirection: 'column' }
const fillStyle: CSSProperties = { flex: 1, minHeight: 0 }

const DeliveryDemo = () => {
  // 基本用法
  const [visible1, setVisible1] = useState(false)
  const [desc1, setDesc1] = useState('')
  const [data1, setData1] = useState<DeliveryData[]>([
    {
      label: '1',
      text: '时间配送',
      desc: '可按照具体时间配送',
      type: 'date',
      times: weekDates.map((item, index) => ({
        ...item,
        selected: index === 0 ? true : undefined,
        disabled: index === 1 ? true : undefined,
      })),
    },
  ])

  // 标准达、京准达
  const [visible2, setVisible2] = useState(false)
  const [desc2, setDesc2] = useState('')
  const [data2, setData2] = useState<DeliveryData[]>([
    { label: '1', text: '标准达', desc: '标准达配送时间', type: 'date-time', times: dateTimeData },
    {
      label: '2',
      text: '京准达',
      desc: '京准达配送时间',
      type: 'date-time-accurate',
      times: accurateData,
    },
  ])

  // 自定义内容1
  const [visible3, setVisible3] = useState(false)
  const [visible4, setVisible4] = useState(false)
  const [desc3, setDesc3] = useState('')
  const [activeKey3, setActiveKey3] = useState('1')

  // 自定义内容2
  const [visible5, setVisible5] = useState(false)
  const [visible6, setVisible6] = useState(false)
  const [desc4, setDesc4] = useState('')
  const [activeKey4, setActiveKey4] = useState('1')
  const [data4, setData4] = useState<DateTimeType[]>(dateTimeData)

  // 子组件单独使用
  const [visible7, setVisible7] = useState(false)
  const [desc5, setDesc5] = useState('')
  const [activeKey5, setActiveKey5] = useState('1')

  const sure1 = (item: DateTimesType | null, type: string) => {
    const deliveryType = deliveryTypes1.find((value) => value.label === type)
    if (!item) {
      setDesc1(String(deliveryType?.text ?? ''))
      return
    }
    setDesc1([deliveryType?.text, (item as DateType).text].join(','))
    setData1((prev) =>
      prev.map((data) => ({ ...data, times: markDates(data.times as DateType[], item.label) }))
    )
  }

  const sure2 = (item: DateTimesType | null, _type: string, deliveryTime: string) => {
    if (!item) return
    const current = data2.find((data) => data.label === deliveryTime)
    if (current?.type === 'date-time-accurate') {
      const picked = item as DateTimeAccurateType
      const group = picked.children[0]
      const time = slotInfo[group?.children[0]?.label]?.[0]
      setDesc2(['京东快递', picked.title, group?.title, time].join(','))
    } else {
      const picked = item as DateTimeType
      setDesc2(['京东快递', picked.title, picked.children[0]?.text].join(','))
    }
    setData2((prev) =>
      prev.map((data) => {
        if (data.label !== deliveryTime) return data
        return data.type === 'date-time-accurate'
          ? { ...data, times: markAccurate(data.times as DateTimeAccurateType[], item as DateTimeAccurateType) }
          : { ...data, times: markDateTime(data.times as DateTimeType[], item as DateTimeType) }
      })
    )
  }

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <Cell title="请选择" extra={desc1} clickable onClick={() => setVisible1(true)} />
        <Delivery
          visible={visible1}
          deliveryTypes={deliveryTypes1}
          deliveryTimeTitle={<View>送货时间</View>}
          deliveryDateData={data1}
          onCloseMask={() => setVisible1(false)}
          onClose={() => setVisible1(false)}
          onSure={sure1}
        />
      </DemoBlock>

      <DemoBlock title="标准达、京准达">
        <Cell title="请选择" extra={desc2} clickable onClick={() => setVisible2(true)} />
        <Delivery
          visible={visible2}
          deliveryDateData={data2}
          onCloseMask={() => setVisible2(false)}
          onClose={() => setVisible2(false)}
          onSure={sure2}
        />
      </DemoBlock>

      <DemoBlock title="自定义内容1">
        <Cell title="请选择" extra={desc3} clickable onClick={() => setVisible3(true)} />
        <Delivery
          visible={visible3}
          onCloseMask={() => setVisible3(false)}
          onClose={() => setVisible3(false)}
          onSure={() => console.log(desc3)}
        >
          <View style={customStyle} onClick={() => setVisible4(true)}>
            <Text>请选择送货时间 {desc3}</Text>
            <Text>...</Text>
          </View>
        </Delivery>
        <Popup
          visible={visible4}
          position="bottom"
          style={popupStyle}
          title="选择送货时间"
          overlayStyle={{ backgroundColor: 'transparent' }}
          closeable
          round
          onClose={() => setVisible4(false)}
        >
          <DeliveryDate
            style={fillStyle}
            activeKey={activeKey3}
            data={weekDates}
            onSelect={(item) => {
              setActiveKey3(item.label)
              setDesc3(String(item.text))
              setVisible4(false)
            }}
          />
        </Popup>
      </DemoBlock>

      <DemoBlock title="自定义内容2">
        <Cell title="请选择" extra={desc4} clickable onClick={() => setVisible5(true)} />
        <Delivery
          visible={visible5}
          onCloseMask={() => setVisible5(false)}
          onClose={() => setVisible5(false)}
          onSure={() => console.log(desc4)}
        >
          <View style={customStyle} onClick={() => setVisible6(true)}>
            <View>
              <Text>请选择送货时间</Text>
              <View>{desc4}</View>
            </View>
            <Text>...</Text>
          </View>
        </Delivery>
        <Popup
          visible={visible6}
          position="bottom"
          style={popupStyle}
          title="选择送货时间"
          overlayStyle={{ backgroundColor: 'transparent' }}
          closeable
          round
          onClose={() => setVisible6(false)}
        >
          <DeliveryDateTime
            style={fillStyle}
            activeKey={activeKey4}
            data={data4}
            onSelect={(item) => {
              setData4((prev) => markDateTime(prev, item))
              setActiveKey4(item.label)
              setDesc4(`${item.title},${item.children[0]?.text}`)
              setVisible6(false)
            }}
          />
        </Popup>
      </DemoBlock>

      <DemoBlock title="子组件单独使用">
        <Cell title="请选择" extra={desc5} clickable onClick={() => setVisible7(true)} />
        <Popup
          visible={visible7}
          position="bottom"
          style={popupStyle}
          title="选择送货时间"
          closeable
          round
          onClose={() => setVisible7(false)}
        >
          <DeliveryDate
            style={fillStyle}
            activeKey={activeKey5}
            data={weekDates}
            onSelect={(item) => {
              setActiveKey5(item.label)
              setDesc5(String(item.text))
              setVisible7(false)
            }}
          />
        </Popup>
      </DemoBlock>
    </DemoPage>
  )
}

export default DeliveryDemo
