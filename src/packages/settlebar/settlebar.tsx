import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Checkbox } from '@nutui/nutui-react-taro'
import { Loading } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import { getRect } from '../../utils/rect'
import { useUuid } from '../../utils/use-uuid'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'

export interface SettleBarProps extends IComponent {
  total: numericProp
  totalText: string
  totalAlign: 'left' | 'right'
  settleButtonText: string
  disabled: boolean
  loading: boolean
  safeAreaInsetBottom: boolean
  /** fixed 时, 是否在原位置生成等高占位 */
  placeholder: boolean
  /** 是否固定在页面底部; false 时按普通块级元素渲染 */
  fixed: boolean
  settleCount: ReactNode
  showZero: boolean
  noCount: boolean
  customWarning: ReactNode
  customTotal: ReactNode
  /** 传 null / '' / false 隐藏全选; 传节点替换全选 */
  customSelectAll: ReactNode
  customTotalPrice: ReactNode
  customTotalExtra: ReactNode
  customButton: ReactNode
  isCheckedAll: boolean
  onClickButton: () => void
  onSelectAll: (checked: boolean) => void
}

/** 结算按钮上是否展示数量 */
const shouldShowSettleCount = (
  noCount: boolean,
  showZero: boolean,
  settleCount: ReactNode
) => !noCount && (showZero || (settleCount !== 0 && settleCount !== '0'))

export const SettleBar: FunctionComponent<Partial<SettleBarProps>> = (props) => {
  const { locale } = useConfig()
  const {
    total = 0,
    totalText = locale.settleBar.totalText,
    totalAlign = 'right',
    settleButtonText = locale.settleBar.settleButtonText,
    disabled = false,
    loading = false,
    className,
    style,
    settleCount = 0,
    customWarning,
    safeAreaInsetBottom = true,
    placeholder = false,
    fixed = true,
    showZero = true,
    noCount = false,
    customTotal,
    customSelectAll,
    customTotalPrice,
    customButton,
    customTotalExtra,
    isCheckedAll = false,
    onClickButton,
    onSelectAll,
  } = props

  const b = bem('settle-bar')
  const id = useUuid('nb-settle-bar')
  const [height, setHeight] = useState(0)
  const needPlaceholder = fixed && placeholder

  useEffect(() => {
    if (!needPlaceholder) return
    let alive = true
    Taro.nextTick(() => {
      getRect(`#${id}`).then((rect) => {
        if (alive) setHeight(rect.height)
      })
    })
    return () => {
      alive = false
    }
  }, [needPlaceholder, id, customWarning])

  const inactive = disabled || loading

  const handleSettle = () => {
    if (!inactive) onClickButton?.()
  }

  const renderSelectAll = () => {
    // 显式传了假值 (''/null/false) 时隐藏全选
    if (customSelectAll !== undefined && !customSelectAll) return null
    return (
      <View className={b('select-all')}>
        {customSelectAll || (
          <Checkbox
            checked={isCheckedAll}
            label={locale.settleBar.selectAll}
            onChange={(checked) => onSelectAll?.(checked)}
          />
        )}
      </View>
    )
  }

  const renderTotal = () => {
    if (customTotal) return customTotal
    return (
      <>
        {customTotalPrice || (
          <View className={b('total-inner')}>
            <Text className={b('total-text')}>
              {totalText}
              {locale.settleBar.colon}
            </Text>
            <Text className={b('total-price')}>¥{total}</Text>
          </View>
        )}
        {customTotalExtra}
      </>
    )
  }

  const renderButton = () => {
    if (customButton) return customButton
    return (
      <View className={b('button', { disabled: inactive })} onClick={handleSettle}>
        {loading && <Loading className={b('button-loading')} size={14} />}
        <Text>{settleButtonText}</Text>
        {shouldShowSettleCount(noCount, showZero, settleCount) && (
          <Text className={b('button-count')}>({settleCount})</Text>
        )}
      </View>
    )
  }

  const bar = (
    <View
      id={id}
      className={classNames(
        b({ fixed, 'safe-area': safeAreaInsetBottom }),
        className
      )}
      style={style}
    >
      {customWarning && (
        <View className={b('warning')}>
          <View className={b('warning-mask')} />
          <View className={b('warning-content')}>{customWarning}</View>
        </View>
      )}
      <View className={b('main')}>
        {renderSelectAll()}
        <View className={b('total', { [totalAlign]: true })}>{renderTotal()}</View>
        {renderButton()}
      </View>
    </View>
  )

  if (!needPlaceholder) return bar

  return (
    <View className={b('placeholder')} style={{ height: `${height}px` }}>
      {bar}
    </View>
  )
}

SettleBar.displayName = 'NbSettleBar'
