import { useState } from 'react'
import { Cell } from '@nutui/nutui-react-taro'
import { Heart, HeartFill, MaskClose, ArrowLeftSmall } from '@nutui/icons-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/cell/style/css'
import { Address } from './index'
import type {
  AddressExistItem,
  ChangeCallBack,
  ClickItemResolve,
  CloseCallBack,
  CloseCallBackData,
  RegionData,
} from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const addressData: Record<'province' | 'city' | 'country' | 'town', RegionData[]> = {
  province: [
    { id: 1, name: '北京', title: 'B' },
    { id: 2, name: '广西', title: 'G' },
    { id: 3, name: '江西', title: 'J' },
    { id: 4, name: '四川', title: 'S' },
    { id: 5, name: '浙江', title: 'Z' },
  ],
  city: [
    { id: 7, name: '朝阳区', title: 'C' },
    { id: 8, name: '崇文区', title: 'C' },
    { id: 9, name: '昌平区', title: 'C' },
    { id: 10, name: '石景山区', title: 'S' },
  ],
  country: [
    { id: 3, name: '八里庄街道', title: 'B' },
    { id: 9, name: '北苑', title: 'B' },
    { id: 4, name: '常营乡', title: 'C' },
  ],
  town: [],
}

const existAddressData: AddressExistItem[] = [
  {
    id: 1,
    addressDetail: '',
    cityName: '通州区',
    countyName: '次渠镇',
    provinceName: '北京市',
    selectedAddress: true,
    townName: '',
    name: 'Ames',
    phone: '182****1718',
  },
  {
    id: 2,
    addressDetail: '',
    cityName: '钓鱼岛全区',
    countyName: '',
    provinceName: '钓鱼岛',
    selectedAddress: false,
    townName: '',
    name: 'Black',
    phone: '182****1718',
  },
  {
    id: 3,
    addressDetail: '京东大厦',
    cityName: '大兴区',
    countyName: '科创十一街18号院',
    provinceName: '北京市',
    selectedAddress: false,
    townName: '',
    name: 'Cobe',
    phone: '182****1718',
  },
]

type PopupKey = 'normal' | 'select' | 'elevator' | 'lazy' | 'exist' | 'customIcon' | 'other'

const TITLE = '选择地址'

const existText = (val: CloseCallBack) => {
  if (val.type === 'exist') {
    const d = val.data as AddressExistItem
    return d.provinceName
      ? d.provinceName + d.cityName + d.countyName + d.townName + d.addressDetail
      : ''
  }
  return (val.data as CloseCallBackData).addressStr
}

const AddressDemo = () => {
  const [visible, setVisible] = useState<Record<PopupKey, boolean>>({
    normal: false,
    select: false,
    elevator: false,
    lazy: false,
    exist: false,
    customIcon: false,
    other: false,
  })
  const [text, setText] = useState<Record<PopupKey, string>>({
    normal: TITLE,
    select: TITLE,
    elevator: TITLE,
    lazy: TITLE,
    exist: TITLE,
    customIcon: TITLE,
    other: TITLE,
  })
  const [existAddress, setExistAddress] = useState(existAddressData)

  // 选择自定义地址: 选中上一级后再给下一级数据
  const [city, setCity] = useState<RegionData[]>([])
  const [country, setCountry] = useState<RegionData[]>([])
  // 异步加载
  const [lazyCity, setLazyCity] = useState<RegionData[]>([])
  const [lazyCountry, setLazyCountry] = useState<RegionData[]>([])
  const [loading, setLoading] = useState(false)

  const [normalSelect, setNormalSelect] = useState<(string | number)[]>([1, 0, 3])
  const [select, setSelect] = useState<(string | number)[]>([1, 7, 3])
  const [elevatorSelect, setElevatorSelect] = useState<(string | number)[]>([1, 7, 3])
  const [lazySelect, setLazySelect] = useState<(string | number)[]>([])

  const open = (key: PopupKey) => setVisible((v) => ({ ...v, [key]: true }))
  const hide = (key: PopupKey) => setVisible((v) => ({ ...v, [key]: false }))

  const onChange = (cal: ChangeCallBack, key: PopupKey) => {
    console.log('change', cal, key)
    if (key === 'normal' || key === 'other') {
      setTimeout(() => {
        if (cal.next === 'city') setCity([...addressData.city])
        else if (cal.next === 'country') setCountry([...addressData.country])
        else hide(key)
      }, 200)
    } else if (cal.next === 'town') {
      hide(key)
    }
  }

  const onClickItem = (cal: ChangeCallBack, resolve: ClickItemResolve) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (cal.next === 'city') setLazyCity([...addressData.city])
      else if (cal.next === 'country') setLazyCountry([...addressData.country])
      else {
        resolve(false)
        return
      }
      resolve(true)
    }, 1000)
  }

  const onClose = (val: CloseCallBack, key: PopupKey, setIds?: (ids: string[]) => void) => {
    console.log('close', val)
    const str = existText(val)
    if (str) setText((t) => ({ ...t, [key]: str }))
    if (setIds && val.type !== 'exist') {
      setIds((val.data as CloseCallBackData).addressIdStr.split('_'))
    }
    hide(key)
  }

  const onSelected = (prev: AddressExistItem, now: AddressExistItem, list: AddressExistItem[]) => {
    console.log('selected', prev, now)
    setExistAddress(list)
  }

  return (
    <DemoPage>
      <DemoBlock title="选择自定义地址" plain>
        <Cell title={TITLE} extra={text.normal} onClick={() => open('normal')} />
      </DemoBlock>
      <DemoBlock title="选中省市区" plain>
        <Cell title={TITLE} extra={text.select} onClick={() => open('select')} />
      </DemoBlock>
      <DemoBlock title="楼层展示地址信息" plain>
        <Cell title={TITLE} extra={text.elevator} onClick={() => open('elevator')} />
      </DemoBlock>
      <DemoBlock title="异步加载" plain>
        <Cell title={TITLE} extra={text.lazy} onClick={() => open('lazy')} />
      </DemoBlock>
      <DemoBlock title="选择已有地址" plain>
        <Cell title={TITLE} extra={text.exist} onClick={() => open('exist')} />
      </DemoBlock>
      <DemoBlock title="自定义图标" plain>
        <Cell title={TITLE} extra={text.customIcon} onClick={() => open('customIcon')} />
      </DemoBlock>
      <DemoBlock title="自定义地址与已有地址切换" plain>
        <Cell title={TITLE} extra={text.other} onClick={() => open('other')} />
      </DemoBlock>

      <Address
        modelValue={visible.normal}
        modelSelect={normalSelect}
        province={addressData.province}
        city={city}
        country={country}
        customAddressTitle={TITLE}
        onChange={(cal) => onChange(cal, 'normal')}
        onClose={(val) => onClose(val, 'normal', setNormalSelect)}
      />

      <Address
        modelValue={visible.select}
        modelSelect={select}
        {...addressData}
        customAddressTitle={TITLE}
        onChange={(cal) => onChange(cal, 'select')}
        onClose={(val) => onClose(val, 'select', setSelect)}
      />

      <Address
        modelValue={visible.elevator}
        type="elevator"
        modelSelect={elevatorSelect}
        {...addressData}
        height="270px"
        customAddressTitle={TITLE}
        onChange={(cal) => onChange(cal, 'elevator')}
        onClose={(val) => onClose(val, 'elevator', setElevatorSelect)}
      />

      <Address
        modelValue={visible.lazy}
        modelSelect={lazySelect}
        province={addressData.province}
        city={lazyCity}
        country={lazyCountry}
        customAddressTitle={TITLE}
        loading={loading}
        onClickItem={onClickItem}
        onClose={(val) => onClose(val, 'lazy', setLazySelect)}
      />

      <Address
        modelValue={visible.exist}
        type="exist"
        existAddress={existAddress}
        isShowCustomAddress={false}
        existAddressTitle="配送至"
        onSelected={onSelected}
        onClose={(val) => onClose(val, 'exist')}
      />

      <Address
        modelValue={visible.customIcon}
        type="exist"
        existAddress={existAddress}
        isShowCustomAddress={false}
        defaultIcon={<Heart size={13} />}
        selectedIcon={<HeartFill size={13} />}
        closeBtnIcon={<MaskClose size={18} />}
        onSelected={onSelected}
        onClose={(val) => onClose(val, 'customIcon')}
      />

      <Address
        modelValue={visible.other}
        type="exist"
        existAddress={existAddress}
        province={addressData.province}
        city={city}
        country={country}
        backBtnIcon={<ArrowLeftSmall size={16} />}
        customAndExistTitle="选择其他地址"
        onChange={(cal) => onChange(cal, 'other')}
        onSelected={onSelected}
        onClose={(val) => onClose(val, 'other')}
        onSwitchModule={(val) => console.log('switchModule', val)}
        onCloseMask={(val) => console.log('closeMask', val)}
      />
    </DemoPage>
  )
}

export default AddressDemo
