import { useState } from 'react'
import { Text } from '@tarojs/components'
import { Ecard } from './index'
import type { DataListItem } from './index'
import mathMethods from '../../utils/math'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const { accurateMultiply } = mathMethods

const dataList: DataListItem[] = [{ price: 10 }, { price: 20 }, { price: 30 }, { price: 40 }]
const dataList6: DataListItem[] = [...dataList, { price: 50 }, { price: 60 }]

const blockStyle = { padding: '16px' }

const EcardDemo = () => {
  const [log, setLog] = useState('')

  const onChangeInput = (val: number | '', money: number) =>
    setLog(`onChangeInput: 面值 ${val}, 总价 ${money}`)
  const onChange = (item: DataListItem, money: number) =>
    setLog(`onChange: 面值 ${item.price}, 总价 ${money}`)
  const onChangeStep = (num: number, price: number, money: number) =>
    setLog(`onChangeStep: 数量 ${num}, 面值 ${price}, 总价 ${money}`)

  return (
    <DemoPage>
      <DemoBlock title="基础用法">
        <Ecard
          style={blockStyle}
          dataList={dataList}
          onChangeInput={onChangeInput}
          onChange={onChange}
          onChangeStep={onChangeStep}
        />
        {log && (
          <Text style={{ display: 'block', padding: '0 16px 12px', fontSize: '12px', color: '#888b94' }}>
            {log}
          </Text>
        )}
      </DemoBlock>
      <DemoBlock title="自定义价格处理函数">
        <Ecard
          style={blockStyle}
          chooseText="100以内打九折, 超过100打八折!"
          dataList={dataList}
          handleMoney={(money) => {
            if (money < 100) return accurateMultiply(money, 0.9)
            return accurateMultiply(money, 0.8)
          }}
        />
      </DemoBlock>
      <DemoBlock title="自定义一行展示电子卡数量">
        <Ecard style={blockStyle} chooseText="请选择电子卡面值" rowNum={3} dataList={dataList6} />
      </DemoBlock>
    </DemoPage>
  )
}

export default EcardDemo
