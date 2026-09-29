import { useMemo, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { InputNumber } from '@nutui/nutui-react-taro'
import type { InputNumberProps } from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import {
  calcEcardMoney,
  getEcardItemWidth,
  getEcardPrice,
  normalizeEcardCustomValue,
} from './utils'

export interface DataListItem {
  price: number
}

export interface EcardProps extends IComponent {
  chooseText: ReactNode
  suffix: string
  otherValueText: ReactNode
  dataList: Array<DataListItem>
  /** 其它面值最小值 */
  cardAmountMin: number
  /** 其它面值最大值 */
  cardAmountMax: number
  /** 数量步进器 props (NutUI React Taro 3.x InputNumber) */
  inputNumberProps: Partial<InputNumberProps>
  placeholder: string
  rowNum: number
  handleMoney: (money: number) => any
  onChange: (item: DataListItem, money: number) => void
  onChangeInput: (val: number | '', money: number) => void
  onChangeStep: (num: number, price: number, money: number) => void
}

const defaultInputNumberProps: Partial<InputNumberProps> = { min: 1, max: 9999 }
const identity = (money: number) => money

export const Ecard: FunctionComponent<Partial<EcardProps>> = ({
  className,
  style,
  chooseText,
  suffix = '¥',
  otherValueText,
  dataList = [],
  cardAmountMin = 1,
  cardAmountMax = 9999,
  inputNumberProps,
  placeholder,
  rowNum = 2,
  handleMoney = identity,
  onChange,
  onChangeInput,
  onChangeStep,
}) => {
  const { locale } = useConfig()
  const b = bem('ecard')
  const stepperProps = { ...defaultInputNumberProps, ...inputNumberProps }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [customValue, setCustomValue] = useState<number | ''>('')
  const [inputFocus, setInputFocus] = useState(false)
  const [cardAmount, setCardAmount] = useState(() =>
    Number(stepperProps.value ?? stepperProps.defaultValue ?? stepperProps.min ?? 1)
  )

  const currentPrice = getEcardPrice(dataList, currentIndex, customValue)
  const money = useMemo(
    () => handleMoney(calcEcardMoney(currentPrice, cardAmount)),
    [currentPrice, cardAmount, handleMoney]
  )
  const itemWidth = getEcardItemWidth(rowNum)

  const handleClick = (item: DataListItem, index: number) => {
    setCurrentIndex(index)
    setCustomValue('')
    setInputFocus(false)
    onChange?.(item, handleMoney(calcEcardMoney(item.price, cardAmount)))
  }

  const handleInputClick = () => {
    setCurrentIndex(-1)
    setInputFocus(true)
  }

  const handleInput = (raw: string) => {
    const value = normalizeEcardCustomValue(raw, cardAmountMin, cardAmountMax)
    setCurrentIndex(-1)
    setCustomValue(value)
    onChangeInput?.(value, handleMoney(calcEcardMoney(value, cardAmount)))
  }

  const handleChangeStep: InputNumberProps['onChange'] = (param, e) => {
    const num = Number(param)
    setCardAmount(num)
    inputNumberProps?.onChange?.(param, e)
    onChangeStep?.(num, currentPrice, handleMoney(calcEcardMoney(currentPrice, num)))
  }

  return (
    <View className={classNames(b(), className)} style={style}>
      <View className={b('title')}>{chooseText || locale.ecard.chooseText}</View>
      <View className={b('list')}>
        {dataList.map((item, index) => (
          <View
            className={b('item', { active: currentIndex === index })}
            style={{ width: `${itemWidth}%` }}
            key={index}
            onClick={() => handleClick(item, index)}
          >
            {item.price}
          </View>
        ))}
        <View
          className={b('input', { active: currentIndex === -1 })}
          onClick={handleInputClick}
        >
          <View className={b('input-label')}>
            {otherValueText || locale.ecard.otherValueText}
          </View>
          <View className={b('input-con')}>
            <Input
              className={b('input-field')}
              type="number"
              value={customValue === '' ? '' : String(customValue)}
              focus={inputFocus}
              placeholder={placeholder || locale.ecard.placeholder}
              placeholderClass={b('input-placeholder')}
              onInput={(e) => handleInput(e.detail.value)}
              onBlur={() => setInputFocus(false)}
            />
            <Text className={b('input-suffix')}>{suffix}</Text>
          </View>
        </View>
        <View className={b('step')}>
          <Text className={b('money')}>
            {suffix}
            {money}
          </Text>
          <InputNumber {...stepperProps} value={cardAmount} onChange={handleChangeStep} />
        </View>
      </View>
    </View>
  )
}

Ecard.displayName = 'NbEcard'
