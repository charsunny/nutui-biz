import { useEffect, useMemo, useRef, useState } from 'react'
import type { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Popup } from '@nutui/nutui-react-taro'
import { ArrowLeft, Close } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import { useConfig } from '../configprovider'
import { CustomRender } from './customRender'
import { ExistRender } from './existRender'
import {
  REGION_KEYS,
  buildRegionResult,
  canAdvance,
  emptySelectedRegion,
  getLevels,
  nextRegionKey,
  resetRegionsAfter,
  resolveSelection,
  selectExistAddress,
  selectRegionItem,
} from './region'
import type {
  AddressList,
  AddressProps,
  AddressType,
  ChangeCallBack,
  CloseCallBack,
  RegionData,
  SelectedRegionObj,
} from './type'

const EMPTY: never[] = []

export const Address: FunctionComponent<Partial<AddressProps>> = (props) => {
  const { locale } = useConfig()
  const {
    className,
    style,
    modelValue = false,
    modelSelect = EMPTY,
    type = 'custom',
    height = '200px',
    customAddressTitle = locale.address.selectRegion,
    existAddress = EMPTY,
    existAddressTitle = locale.address.deliveryTo,
    province = EMPTY,
    city = EMPTY,
    country = EMPTY,
    town = EMPTY,
    isShowCustomAddress = true,
    customAndExistTitle = locale.address.chooseAnotherAddress,
    selectedIcon,
    defaultIcon,
    closeBtnIcon = <Close size={16} />,
    backBtnIcon = <ArrowLeft size={16} />,
    loading = false,
    bottom,
    onChange,
    onSelected,
    onClose,
    onClickItem,
    onCloseMask,
    onSwitchModule,
    onTabChecked,
  } = props
  const b = bem('address')

  const lists = { province, city, country, town }
  const levels = useMemo(() => getLevels({ town }), [town])
  const levelsRef = useRef(levels)
  levelsRef.current = levels

  const [privateType, setPrivateType] = useState<AddressType>(type)
  const [visible, setVisible] = useState(modelValue)
  const [tabIndex, setTabIndex] = useState(0)
  const [selected, setSelected] = useState<SelectedRegionObj>(emptySelectedRegion)
  const [clicked, setClicked] = useState<RegionData | null>(null)
  const [existList, setExistList] = useState<AddressList[]>(existAddress)
  const [selectedExist, setSelectedExist] = useState<AddressList>({} as AddressList)

  useEffect(() => setVisible(modelValue), [modelValue])
  useEffect(() => setPrivateType(type), [type])
  useEffect(() => setExistList(existAddress), [existAddress])

  // modelSelect 变化时还原已选地区
  const selectKey = modelSelect.join('_')
  useEffect(() => {
    const res = resolveSelection(modelSelect, lists, levels)
    if (!res) return
    setSelected(res.selected)
    setTabIndex(res.tabIndex)
  }, [selectKey])

  // 选择地区, 支持 onClickItem 异步加载下一级
  const handleSelectRegion = async (item: RegionData) => {
    const index = tabIndex
    setSelected(selectRegionItem(selected, index, item))
    setClicked(item)
    const cal: ChangeCallBack = {
      next: nextRegionKey(index),
      value: item,
      custom: REGION_KEYS[index],
    }
    let ok = true
    if (onClickItem) {
      ok = await new Promise<boolean>((resolve) => {
        onClickItem({ ...cal }, resolve)
      })
    }
    if (ok && canAdvance(index, levelsRef.current)) setTabIndex(index + 1)
    onChange?.(cal)
    if (!ok && onClickItem) setVisible(false)
  }

  const handleTabClick = (index: number) => {
    if (index > tabIndex) return
    setTabIndex(index)
    setSelected(resetRegionsAfter(selected, index))
    onTabChecked?.(REGION_KEYS[index])
  }

  const handleSelectExist = (index: number) => {
    const res = selectExistAddress(existList, index)
    setExistList(res.list)
    setSelectedExist(res.item)
    onSelected?.(res.prev, res.item, res.list)
    setVisible(false)
  }

  const handleSwitchModule = () => {
    const nextType: AddressType = privateType === 'exist' ? 'custom' : 'exist'
    setPrivateType(nextType)
    onSwitchModule?.({ type: nextType })
  }

  // Popup 关闭 (遮罩 / 关闭按钮 / 选择完成 / modelValue=false) 时统一回调 onClose
  const handlePopupClose = () => {
    setVisible(false)
    const res: CloseCallBack =
      privateType === 'exist'
        ? { type: privateType, data: selectedExist }
        : { type: privateType, data: buildRegionResult(selected) }
    onClose?.(res)
  }

  const handleCrossClick = () => {
    onCloseMask?.({ closeWay: 'cross' })
    setVisible(false)
  }

  const showBack = type === 'exist' && privateType !== 'exist' && !!backBtnIcon

  return (
    <Popup
      visible={visible}
      position="bottom"
      round
      onOverlayClick={() => {
        onCloseMask?.({ closeWay: 'mask' })
        return true
      }}
      onClose={handlePopupClose}
    >
      <View className={classNames(b(), className)} style={style}>
        <View className={b('header')}>
          <View className={b('header-left')} onClick={showBack ? handleSwitchModule : undefined}>
            {showBack && backBtnIcon}
          </View>
          <View className={b('header-title')}>
            {privateType === 'exist' ? existAddressTitle : customAddressTitle}
          </View>
          <View className={b('header-right')} onClick={closeBtnIcon ? handleCrossClick : undefined}>
            {closeBtnIcon}
          </View>
        </View>

        {privateType === 'exist' ? (
          <ExistRender
            existAddress={existList}
            selectedIcon={selectedIcon}
            defaultIcon={defaultIcon}
            isShowCustomAddress={isShowCustomAddress}
            customAndExistTitle={customAndExistTitle}
            onSelect={handleSelectExist}
            onSwitchModule={handleSwitchModule}
          />
        ) : (
          <CustomRender
            {...lists}
            type={privateType}
            levels={levels}
            tabIndex={tabIndex}
            selected={selected}
            height={height}
            loading={loading}
            clicked={clicked}
            onSelect={handleSelectRegion}
            onTabClick={handleTabClick}
          />
        )}
        {bottom}
      </View>
    </Popup>
  )
}

Address.displayName = 'NbAddress'
