import type { FunctionComponent } from 'react'
import { Input } from '@tarojs/components'
import type { BaseEventOrig, InputProps } from '@tarojs/components'
import type { numericProp } from '../../../utils/props'
import { sanitizePriceInput } from '../utils'

export interface InputNumProps {
  className?: string
  placeholderClass?: string
  placeholder?: string
  value: numericProp
  onNumInput: (val: string) => void
}

/** 只能输入数字的价格输入框 */
export const InputNum: FunctionComponent<InputNumProps> = ({
  className,
  placeholderClass,
  placeholder,
  value,
  onNumInput,
}) => {
  const handleInput = (e: BaseEventOrig<InputProps.inputEventDetail>) => {
    const next = sanitizePriceInput(e.detail.value)
    onNumInput(next)
    // 小程序端: 返回值会替换输入框内容, 过滤掉非数字
    return next
  }

  return (
    <Input
      className={className}
      placeholderClass={placeholderClass}
      placeholder={placeholder}
      type="number"
      value={value === undefined || value === null ? '' : String(value)}
      onInput={handleInput}
    />
  )
}

InputNum.displayName = 'NbGoodsFilterInputNum'
