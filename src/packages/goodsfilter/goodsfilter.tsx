import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Popup } from '@nutui/nutui-react-taro'
import { ArrowDown, Location } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import { InputNum } from './components/InputNum'
import {
  EMPTY_PRICE_RANGE,
  buildGoodsFilterResult,
  getSelectedNames,
  getVisibleValues,
  isFilterAttrSelected,
  isGoodsAttrExpanded,
  isGoodsAttrSelected,
  normalizePriceRanges,
  selectDataToState,
  toggleFilterAttr,
  toggleGoodsAttrExpand,
  toggleGoodsAttrValue,
} from './utils'
import type {
  FilterId,
  GoodsFilterAttrGroup,
  GoodsFilterAttrSelection,
  GoodsFilterPriceRange,
  GoodsFilterResult,
  GoodsFilterSelectData,
  GoodsFilterState,
  GoodsFilterValue,
} from './utils'

/** 商品属性每行展示几个 */
const VALUES_PER_ROW = 3

export interface GoodsFilterProps extends IComponent {
  /** 是否展示 */
  visible: boolean
  /** 确定按钮文案 */
  confirmText: ReactNode
  /** 重置按钮文案 */
  resetText: ReactNode
  /** 价格区间标题 */
  priceRangeTitle: ReactNode
  /** 配送地址标题 */
  addressTitle: ReactNode
  /** 选中的地址, 为空时展示"您还没有选中的地址" */
  selectedAddress: string
  /** 是否展示配送地址区块 (业务不支持按地址筛选时应关闭) */
  showAddress: boolean
  /** 重置按钮是否禁用 */
  resetDisable: boolean
  /** 推荐价格区间 */
  priceRanges: Partial<GoodsFilterPriceRange>[]
  /** 地址下方的筛选项 (多选) */
  filterAttrs: GoodsFilterValue[]
  /** 商品属性筛选项 */
  goodsAttrs: GoodsFilterAttrGroup[]
  /** 每个属性值的样式 */
  specStyle: CSSProperties
  /** 是否在属性标题右侧展示已选值 */
  selectedSpecShow: boolean
  /** 每类属性收起时最多展示的行数 (每行 3 个) */
  maxLine: number
  /** 展开 / 收起图标, 展开时旋转 180° */
  icon: ReactNode
  /** 回显数据, 打开弹层时写入内部状态 */
  selectData: GoodsFilterSelectData
  /** 自定义底部操作栏 */
  bottom: ReactNode
  onClose: () => void
  onReset: () => void
  onConfirm: (res: GoodsFilterResult) => void
  onClickAddress: () => void
  onSelectedAttrs: (
    attr: GoodsFilterValue,
    selected: boolean,
    selectedAttrs: GoodsFilterValue[]
  ) => void
  onSelectedPrice: (range: GoodsFilterPriceRange) => void
  onBeforeSelected: (done: () => void, selectedValue: GoodsFilterAttrSelection) => void
  onSelectedGoodsAttr: (
    attrs: GoodsFilterAttrGroup & { isExpand: boolean },
    value: GoodsFilterValue
  ) => void
}

const EMPTY_STATE: GoodsFilterState = { filterAttrs: [], goodsAttrs: {} }

export const GoodsFilter: FunctionComponent<Partial<GoodsFilterProps>> = ({
  className,
  style,
  visible = false,
  confirmText,
  resetText,
  priceRangeTitle,
  addressTitle,
  selectedAddress = '',
  showAddress = true,
  resetDisable = false,
  priceRanges,
  filterAttrs,
  goodsAttrs,
  specStyle,
  selectedSpecShow = true,
  maxLine = 2,
  icon,
  selectData,
  bottom,
  onClose,
  onReset,
  onConfirm,
  onClickAddress,
  onSelectedAttrs,
  onSelectedPrice,
  onBeforeSelected,
  onSelectedGoodsAttr,
}) => {
  const { locale } = useConfig()
  const text = locale.goodsfilter
  const b = bem('goods-filter')

  const [state, setState] = useState<GoodsFilterState>(EMPTY_STATE)
  const [priceLow, setPriceLow] = useState<FilterId>('')
  const [priceHigh, setPriceHigh] = useState<FilterId>('')
  const [priceId, setPriceId] = useState<FilterId | undefined>()

  // 打开时用 selectData 回显
  useEffect(() => {
    if (visible && selectData) {
      setState(selectDataToState(selectData))
      setPriceLow(selectData.price?.low ?? '')
      setPriceHigh(selectData.price?.high ?? '')
      setPriceId(undefined)
    }
  }, [selectData, visible])

  const ranges = useMemo(() => normalizePriceRanges(priceRanges), [priceRanges])

  const handleFilterAttr = (attr: GoodsFilterValue) => {
    const { next, selected } = toggleFilterAttr(state.filterAttrs, attr)
    setState({ ...state, filterAttrs: next })
    onSelectedAttrs?.(attr, selected, next)
  }

  const handlePriceInput = (val: string, type: 'low' | 'high') => {
    if (type === 'low') setPriceLow(val)
    else setPriceHigh(val)
    // 手动输入后不再高亮推荐价格
    setPriceId(undefined)
  }

  const handleRecPrice = (range: GoodsFilterPriceRange) => {
    if (range.id === priceId) {
      setPriceId(undefined)
      setPriceLow('')
      setPriceHigh('')
      onSelectedPrice?.({ ...EMPTY_PRICE_RANGE })
    } else {
      setPriceId(range.id)
      setPriceLow(range.low)
      setPriceHigh(range.high)
      onSelectedPrice?.(range)
    }
  }

  const handleGoodsAttr = (group: GoodsFilterAttrGroup, value: GoodsFilterValue) => {
    if (value.id === undefined) return
    const valueId = value.id
    const current = state.goodsAttrs[String(group.id)] || {
      id: group.id,
      values: [],
      isExpand: false,
    }
    const done = () => {
      setState((prev) => ({
        ...prev,
        goodsAttrs: toggleGoodsAttrValue(prev.goodsAttrs, group.id, valueId),
      }))
      onSelectedGoodsAttr?.(
        { ...group, isExpand: isGoodsAttrExpanded(state.goodsAttrs, group.id) },
        value
      )
    }
    if (onBeforeSelected) onBeforeSelected(done, { ...current, values: current.values.slice() })
    else done()
  }

  const handleExpand = (group: GoodsFilterAttrGroup) => {
    setState((prev) => ({
      ...prev,
      goodsAttrs: toggleGoodsAttrExpand(prev.goodsAttrs, group.id),
    }))
  }

  const reset = () => {
    if (resetDisable) return
    setState(EMPTY_STATE)
    setPriceLow('')
    setPriceHigh('')
    setPriceId(undefined)
    onReset?.()
  }

  const confirm = () => {
    const res = buildGoodsFilterResult(
      state,
      { low: priceLow, high: priceHigh },
      selectedAddress
    )
    // 最低价大于最高价时, 输入框同步交换
    setPriceLow(res.price.low)
    setPriceHigh(res.price.high)
    onConfirm?.(res)
  }

  const renderAddress = () => (
    <View className={b('chunk', { address: true })}>
      <View className={b('label')}>{addressTitle ?? text.addressTitle}</View>
      <View className={b('address')}>
        <View className={b('address-icon')}>
          <Location size={12} />
        </View>
        <Text className={b('address-text')} onClick={() => onClickAddress?.()}>
          {selectedAddress || text.noAddress}
        </Text>
        <Text className={b('address-modify')} onClick={() => onClickAddress?.()}>
          {text.modify}
        </Text>
      </View>
    </View>
  )

  const renderFilterAttrs = () =>
    filterAttrs && filterAttrs.length > 0 ? (
      <View className={b('chunk')}>
        <View className={b('options')}>
          {filterAttrs.map((attr, index) => (
            <View key={`${attr.id ?? index}`} className={b('option-cell')}>
              <View
                className={b('option', {
                  active: isFilterAttrSelected(state.filterAttrs, attr),
                })}
                onClick={() => handleFilterAttr(attr)}
              >
                {attr.name}
              </View>
            </View>
          ))}
        </View>
      </View>
    ) : null

  const renderPrice = () => (
    <View className={b('chunk')}>
      <View className={b('label')}>{priceRangeTitle ?? text.priceRangeTitle}</View>
      <View className={b('price-range')}>
        <View className={b('price-input-box')}>
          <InputNum
            className={b('price-input', { low: true })}
            placeholderClass={b('price-placeholder')}
            placeholder={text.lowPrice}
            value={priceLow}
            onNumInput={(val) => handlePriceInput(val, 'low')}
          />
        </View>
        <View className={b('price-cable')} />
        <View className={b('price-input-box')}>
          <InputNum
            className={b('price-input', { high: true })}
            placeholderClass={b('price-placeholder')}
            placeholder={text.highPrice}
            value={priceHigh}
            onNumInput={(val) => handlePriceInput(val, 'high')}
          />
        </View>
      </View>
      {ranges.length > 0 && (
        <View className={b('options', { recommend: true })}>
          {ranges.map((range) => (
            <View key={`${range.id}`} className={b('option-cell')}>
              <View
                className={b('recommend', { active: priceId === range.id })}
                onClick={() => handleRecPrice(range)}
              >
                <Text className={b('recommend-range')}>
                  {range.low}-{range.high}
                </Text>
                <Text className={b('recommend-desc')}>{range.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )

  const renderGoodsAttrs = () =>
    goodsAttrs && goodsAttrs.length > 0 ? (
      <View className={b('list')}>
        {goodsAttrs.map((group) => {
          const selection = state.goodsAttrs[String(group.id)]
          const expanded = isGoodsAttrExpanded(state.goodsAttrs, group.id)
          const values = getVisibleValues(group.values || [], expanded, maxLine, VALUES_PER_ROW)
          const hasMore = (group.values || []).length > values.length || expanded
          return (
            <View key={`${group.id}`} className={b('list-item')}>
              <View className={b('list-item-top')} onClick={() => handleExpand(group)}>
                <Text className={b('list-item-title')}>{group.title}</Text>
                {selectedSpecShow ? (
                  <Text className={b('list-item-subtitle')}>
                    {getSelectedNames(group.values || [], selection)}
                  </Text>
                ) : (
                  <View className={b('list-item-subtitle')} />
                )}
                {hasMore && (
                  <View className={b('list-item-icon', { expand: expanded })}>
                    {icon ?? <ArrowDown size={10} />}
                  </View>
                )}
              </View>
              <View className={b('options', { values: true })}>
                {values.map((value, index) => (
                  <View key={`${value.id ?? index}`} className={b('option-cell')}>
                    <View
                      className={b('option', {
                        active:
                          value.id !== undefined &&
                          isGoodsAttrSelected(state.goodsAttrs, group.id, value.id),
                      })}
                      style={specStyle}
                      onClick={() => handleGoodsAttr(group, value)}
                    >
                      {value.name}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )
        })}
      </View>
    ) : null

  return (
    <Popup
      visible={visible}
      position="right"
      round
      style={{ width: '80%', height: '100%' }}
      onClose={() => onClose?.()}
    >
      <View className={classNames(b(), className)} style={style}>
        <ScrollView className={b('body')} scrollY enhanced showScrollbar={false}>
          {showAddress && renderAddress()}
          {renderFilterAttrs()}
          {renderPrice()}
          <View className={b('gap')} />
          {renderGoodsAttrs()}
        </ScrollView>
        <View className={b('operate')}>
          {bottom ?? (
            <>
              <View
                className={b('btn', { reset: true, disabled: resetDisable })}
                onClick={reset}
              >
                {resetText ?? text.reset}
              </View>
              <View className={b('btn', { confirm: true })} onClick={confirm}>
                {confirmText ?? text.confirm}
              </View>
            </>
          )}
        </View>
      </View>
    </Popup>
  )
}

GoodsFilter.displayName = 'NbGoodsFilter'
