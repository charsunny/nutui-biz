import { Fragment, useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Cell, Checkbox, Swipe, Tag } from '@nutui/nutui-react-taro'
import { Edit } from '@nutui/icons-react-taro'
import classNames from 'classnames'
import bem from '../../utils/bem'
import type { numericProp } from '../../utils/props'
import type { IComponent } from '../../utils/typings'
import { useConfig } from '../configprovider'

export interface ReceiveInvoiceItemExt {
  label: string
  value: string
  [x: string]: any
}

export interface ReceiveInvoiceItem {
  id: numericProp
  name: string
  tel: string
  addres: string
  isDefault: boolean
  extends?: Array<ReceiveInvoiceItemExt>
  [x: string]: any
}

export interface ReceiveInvoiceListProps extends IComponent {
  /** 当前选中联系人的 id */
  defaultValue: numericProp
  list: Array<ReceiveInvoiceItem>
  enableDelete: boolean
  /** 再次点击已选中项是否取消选中, 默认 true。选中态代表业务状态 (如默认地址) 时传 false */
  deselectable?: boolean
  customEdit?: ReactNode
  onEdit?: (item: ReceiveInvoiceItem, index: number) => void
  onSelected?: (item: ReceiveInvoiceItem, index: number) => void
  onDelete?: (item: ReceiveInvoiceItem, index: number) => void
}

const EMPTY: ReceiveInvoiceItem[] = []

// eslint-disable-next-line eqeqeq
const sameId = (a: numericProp, b: numericProp) => a !== '' && a == b

export const ReceiveInvoiceList: FunctionComponent<Partial<ReceiveInvoiceListProps>> = ({
  className,
  style,
  defaultValue = '',
  list = EMPTY,
  enableDelete = false,
  deselectable = true,
  customEdit,
  onSelected,
  onEdit,
  onDelete,
}) => {
  const { locale } = useConfig()
  const b = bem('receive-invoice-list')
  const [current, setCurrent] = useState<numericProp>(defaultValue)

  useEffect(() => setCurrent(defaultValue), [defaultValue])

  const handleSelect = (item: ReceiveInvoiceItem, index: number) => {
    if (sameId(current, item.id)) {
      if (deselectable) setCurrent('')
      return
    }
    setCurrent(item.id)
    onSelected?.(item, index)
  }

  const renderRow = (label: string, value: string, key: string) => (
    <View className={b('row')} key={key}>
      <Text className={b('row-label')}>{label}</Text>
      <Text className={b('row-value')}>{value}</Text>
    </View>
  )

  const renderItem = (item: ReceiveInvoiceItem, index: number) => (
    <Cell.Group className={b('item')}>
      <Cell
        className={b('header')}
        align="center"
        onClick={() => handleSelect(item, index)}
        title={
          <View className={b('title')}>
            {item.isDefault && (
              <Tag className={b('tag')} type="primary">
                {locale.default}
              </Tag>
            )}
            <Text className={b('name')}>{item.name}</Text>
          </View>
        }
        extra={
          <View
            className={b('edit')}
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(item, index)
            }}
          >
            {customEdit || <Edit size={16} />}
          </View>
        }
      />
      <Cell className={b('footer')} onClick={() => handleSelect(item, index)}>
        <View className={b('check')}>
          <Checkbox checked={sameId(current, item.id)} />
        </View>
        <View className={b('info')}>
          {renderRow(locale.tel, item.tel, 'tel')}
          {renderRow(locale.addres, item.addres, 'addres')}
          {item.extends?.map((ext, i) => renderRow(ext.label, ext.value, `ext-${i}`))}
        </View>
      </Cell>
    </Cell.Group>
  )

  return (
    <View className={classNames(b(), className)} style={style}>
      {list.map((item, index) => (
        <Fragment key={String(item.id)}>
          {enableDelete ? (
            <Swipe
              className={b('swipe')}
              rightAction={
                <Button
                  className={b('delete')}
                  type="primary"
                  shape="square"
                  onClick={() => onDelete?.(item, index)}
                >
                  {locale.swipeShell.delete}
                </Button>
              }
            >
              {renderItem(item, index)}
            </Swipe>
          ) : (
            renderItem(item, index)
          )}
        </Fragment>
      ))}
    </View>
  )
}

ReceiveInvoiceList.displayName = 'NbReceiveInvoiceList'
