import React, {
  FunctionComponent,
  CSSProperties,
  useState,
  useEffect
} from 'react'
import { useConfig } from '@/packages/configprovider'
import classNames from 'classnames'
import bem from '@/utils/bem'
import {Button} from '@nutui/nutui-react'
import {GeneralShell} from './generalShell'
import {SwipeShell} from './swipeShell'
import {floatData} from '@/utils'

import { IComponent } from '@/utils/typings'

export interface AddressListProps extends IComponent {
  className: string
  style: CSSProperties
  data: Array<any>
  longPress: boolean
  swipeEdition: boolean
  showBottomButton: boolean
  dataMapOptions: Object
  showSelect: boolean
  onAdd: (event: Event) => void
  onDelIcon: (event: Event, item: Object) => {}
  onEditIcon: (event: Event, item: Object) => {}
  onItemClick: (event: Event, item: Object) => {}
  onSwipeDel: (event: Event, item: Object) => {}
  onLongCopy: (event: Event, item: Object) => {}
  onLongSet: (event: Event, item: Object) => {}
  onLongDel: (event: Event, item: Object) => {}
}

export const AddressList: FunctionComponent<
  Partial<AddressListProps> & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>
> = (props) => {
  const { locale } = useConfig()
  const {
    className,
    style,
    data = [],
    longPress = false,
    swipeEdition = false,
    showBottomButton = true,
    dataMapOptions = {},
    showSelect = false,
    onAdd,
    onDelIcon,
    onEditIcon,
    onItemClick,
    onSwipeDel,
    onLongCopy,
    onLongSet,
    onLongDel,
    ...rest
  } = {
    ...props,
  }

  const b = bem('address-list')

  const addAddress = (event: any) => {
    onAdd && onAdd(event)
    event.stopPropagation();
  }

  const [dataArray, setdataArray] = useState<Array<any>>([])
  const dataInfo = {
    id: 2,
    addressName: '姓名',
    phone: '123****4567',
    defaultAddress: false,
    fullAddress: '北京市通州区测试测试测试测试测试测试测试测试测试'
  };

  const trowelData = () => {
    if(Object.keys(dataMapOptions).length > 0) {
      let floatDataArray = data.map((item) => {
        return floatData(dataInfo, item, dataMapOptions);
      });
      setdataArray(floatDataArray)
    }
  }

  useEffect(() => {
    trowelData()
  }, [data])

  useEffect(() => {
    trowelData()
  }, [])

  const clickDelIcon = (event: Event, item: unknown) => {
    if(item){
      onDelIcon && onDelIcon(event, item)
    }
    event.stopPropagation();
  }

  const clickEditIcon = (event: Event, item: unknown) => {
    if(item){
      onEditIcon && onEditIcon(event, item)
    }
    event.stopPropagation();
  }

  const clickContentItem = (event: Event, item: unknown) => {
    if(item){
      onItemClick && onItemClick(event, item)
    }
    event.stopPropagation();
  }

  const clickSwipeDel = (event: Event, item: unknown) => {
    if(item){
      onSwipeDel && onSwipeDel(event, item)
    }
    event.stopPropagation();
  }

  const clickLongCopy = (event: Event, item: unknown) => {
    if(item){
      onLongCopy && onLongCopy(event, item)
    }
    event.stopPropagation();
  }

  const clickLongSet = (event: Event, item: unknown) => {
    if(item){
      onLongSet && onLongSet(event, item)
    }
    event.stopPropagation();
  }

  const clickLongDel = (event: Event, item: unknown) => {
    if(item){
      onLongDel && onLongDel(event, item)
    }
    event.stopPropagation();
  }

  return (
    <div className={classNames([b(),className])} style={style} {...rest}>
      {swipeEdition ? 
        dataArray.map((item, index) => {
          return <SwipeShell 
                  item={item} 
                  key={index} 
                  onDelIcon={clickDelIcon}
                  onEditIcon={clickEditIcon}
                  onItemClick={clickContentItem}
                  onSwipeDel={clickSwipeDel}
                />
        }) : dataArray.map((item, index) => {
          return <GeneralShell 
                  item={item} 
                  key={index} 
                  longPress={longPress}
                  onDelIcon={clickDelIcon}
                  onEditIcon={clickEditIcon}
                  onItemClick={clickContentItem}
                  onSwipeDel={clickSwipeDel}
                  onLongCopy={clickLongCopy}
                  onLongSet={clickLongSet}
                  onLongDel={clickLongDel}
                />
        })
      }
      {showBottomButton && <div className="nut-address-list__bottom" onClick={addAddress}>
        <Button block type="danger">新建地址</Button>
      </div>}
    </div>
  )
}

AddressList.displayName = 'NutAddressList'
