import type { FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import { InputNumber } from '@nutui/nutui-react-taro'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { nextStepperValue } from './utils'

export interface SkuStepperProps extends IComponent {
  value: number
  stepperMax: string | number
  stepperMin: string | number
  stepperExtraText: (() => ReactNode) | boolean
  stepperTitle: ReactNode
  onAdd: (value: number) => void
  onReduce: (value: number) => void
  onOverLimit: () => void
  onChange: (value: number) => void
}

export const SkuStepper: FunctionComponent<Partial<SkuStepperProps>> = ({
  value = 1,
  stepperMax = 99999,
  stepperMin = 1,
  stepperExtraText,
  stepperTitle,
  onAdd,
  onReduce,
  onOverLimit,
  onChange,
}) => {
  const { locale } = useConfig()
  const b = bem('sku')

  const extra = typeof stepperExtraText === 'function' ? stepperExtraText() : null

  return (
    <View className={b('stepper')}>
      <View className={b('stepper-title')}>{stepperTitle ?? locale.sku.buyNumber}</View>
      <View className={b('stepper-limit')}>{extra}</View>
      <View className={b('stepper-count')}>
        <InputNumber
          value={value}
          min={stepperMin}
          max={stepperMax}
          onPlus={() => onAdd?.(nextStepperValue(value, 1, stepperMin, stepperMax))}
          onMinus={() => onReduce?.(nextStepperValue(value, -1, stepperMin, stepperMax))}
          onOverlimit={() => onOverLimit?.()}
          onChange={(v) => onChange?.(Number(v))}
        />
      </View>
    </View>
  )
}

SkuStepper.displayName = 'NbSkuStepper'
