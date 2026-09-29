import { describe, expect, test } from 'bun:test'
import {
  firstEnabled,
  hasSelected,
  initDeliveryTime,
  initDeliveryType,
  initialSelection,
  isActiveKey,
  resolveAccurateItem,
  resolveDateItem,
  resolveDateTimeItem,
  resolvePanel,
  toAccurateSelection,
  toDateTimeSelection,
} from '../src/packages/delivery/utils'
import type {
  DateTimeAccurateType,
  DateTimeType,
  DateType,
  DeliveryData,
} from '../src/packages/delivery/types'

const dates: DateType[] = [
  { label: '1', text: 'd1', disabled: true },
  { label: '2', text: 'd2' },
  { label: '3', text: 'd3' },
]

const dateTime: DateTimeType[] = [
  { label: 'a', title: 'A', children: [{ label: 'a1', text: '09-15', disabled: true }, { label: 'a2', text: '15-18' }] },
  { label: 'b', title: 'B', children: [{ label: 'b1', text: '09-15' }, { label: 'b2', text: '16-18', selected: true }] },
]

const accurate: DateTimeAccurateType[] = [
  {
    label: 'x',
    title: 'X',
    children: [
      { label: 'am', title: 'AM', children: [{ label: 'x1', text: '9', disabled: true }] },
      { label: 'pm', title: 'PM', children: [{ label: 'x2', text: '15' }] },
    ],
  },
  {
    label: 'y',
    title: 'Y',
    children: [{ label: 'noon', title: 'Noon', children: [{ label: 'y1', text: '12' }] }],
  },
]

describe('helpers', () => {
  test('isActiveKey', () => {
    expect(isActiveKey(undefined)).toBe(false)
    expect(isActiveKey('')).toBe(false)
    expect(isActiveKey(9999)).toBe(false)
    expect(isActiveKey('9999')).toBe(false)
    expect(isActiveKey(0)).toBe(true)
    expect(isActiveKey('1')).toBe(true)
  })

  test('firstEnabled skips disabled, falls back to first', () => {
    expect(firstEnabled(dates)?.label).toBe('2')
    expect(firstEnabled([{ disabled: true, id: 1 }])?.id).toBe(1)
    expect(firstEnabled([])).toBeUndefined()
  })

  test('hasSelected is recursive', () => {
    expect(hasSelected(dateTime[0])).toBe(false)
    expect(hasSelected(dateTime[1])).toBe(true)
    expect(hasSelected({ ...accurate[1], children: [{ label: 'n', title: 'n', children: [{ label: 'z', text: 'z', selected: true }] }] })).toBe(true)
  })
})

describe('DeliveryDate', () => {
  test('activeKey hit wins (number / string compare)', () => {
    expect(resolveDateItem(dates, 3)?.label).toBe('3')
  })
  test('falls back to selected, then first enabled', () => {
    expect(resolveDateItem(dates)?.label).toBe('2')
    expect(resolveDateItem(dates, 9999)?.label).toBe('2')
    expect(resolveDateItem(dates, 'missing')?.label).toBe('2')
    const withSelected = dates.map((d) => ({ ...d, selected: d.label === '3' }))
    expect(resolveDateItem(withSelected)?.label).toBe('3')
  })
  test('empty data', () => {
    expect(resolveDateItem([])).toBeUndefined()
    expect(resolveDateItem(undefined, '1')).toBeUndefined()
  })
})

describe('DeliveryDateTime', () => {
  test('panel: activeKey > panel with selected > first', () => {
    expect(resolvePanel(dateTime, 'a')?.label).toBe('a')
    expect(resolvePanel(dateTime)?.label).toBe('b')
    expect(resolvePanel(accurate)?.label).toBe('x')
  })
  test('item: selected > first enabled', () => {
    expect(resolveDateTimeItem(dateTime[0])?.label).toBe('a2')
    expect(resolveDateTimeItem(dateTime[1])?.label).toBe('b2')
    expect(resolveDateTimeItem(undefined)).toBeUndefined()
  })
  test('selection payload keeps only the picked child', () => {
    const payload = toDateTimeSelection(dateTime[0], dateTime[0].children[1])
    expect(payload.label).toBe('a')
    expect(payload.children.map((c) => c.label)).toEqual(['a2'])
    expect(dateTime[0].children.length).toBe(2)
  })
})

describe('DeliveryDateTimeAccurate', () => {
  test('first enabled across groups', () => {
    const hit = resolveAccurateItem(accurate[0])
    expect(hit?.group.label).toBe('pm')
    expect(hit?.item.label).toBe('x2')
  })
  test('selected wins', () => {
    const panel: DateTimeAccurateType = {
      ...accurate[0],
      children: [
        { label: 'am', title: 'AM', children: [{ label: 'x0', text: '8' }, { label: 'x1', text: '9', selected: true }] },
      ],
    }
    expect(resolveAccurateItem(panel)?.item.label).toBe('x1')
  })
  test('all disabled falls back to first item', () => {
    const panel: DateTimeAccurateType = {
      label: 'z',
      title: 'Z',
      children: [{ label: 'g', title: 'G', children: [{ label: 'z1', text: '1', disabled: true }] }],
    }
    expect(resolveAccurateItem(panel)?.item.label).toBe('z1')
    expect(resolveAccurateItem({ label: 'e', title: 'E', children: [] })).toBeUndefined()
  })
  test('selection payload is panel → group → item', () => {
    const p = toAccurateSelection(accurate[0], accurate[0].children[1], accurate[0].children[1].children[0])
    expect(p.label).toBe('x')
    expect(p.children).toHaveLength(1)
    expect(p.children[0].label).toBe('pm')
    expect(p.children[0].children.map((c) => c.label)).toEqual(['x2'])
  })
})

describe('Delivery', () => {
  const data: DeliveryData[] = [
    { label: 't1', text: 'date', type: 'date', times: dates },
    { label: 't2', text: 'date-time', type: 'date-time', times: dateTime },
    { label: 't3', text: 'accurate', type: 'date-time-accurate', times: accurate },
    { label: 't4', text: 'ignored (> MAX_COUNT)', type: 'date', times: dates },
  ]

  test('initialSelection per type', () => {
    expect((initialSelection(data[0]) as DateType).label).toBe('2')
    const dt = initialSelection(data[1]) as DateTimeType
    expect(dt.label).toBe('b')
    expect(dt.children[0].label).toBe('b2')
    const acc = initialSelection(data[2]) as DateTimeAccurateType
    expect(acc.label).toBe('x')
    expect(acc.children[0].children[0].label).toBe('x2')
    expect(initialSelection({ label: 'e', text: 'e', type: 'date', times: [] })).toBeNull()
  })

  test('current tab is the last tab with a selected time', () => {
    const state = initDeliveryTime(data)
    expect(state.deliveryTime).toBe('t2')
    expect(Object.keys(state.selections)).toEqual(['t1', 't2', 't3'])
    expect(state.activeKeys).toEqual({ t1: '2', t2: 'b', t3: 'x' })
  })

  test('without selected flags falls back to first enabled tab', () => {
    const state = initDeliveryTime([
      { label: 'd', text: 'd', type: 'date', times: dates, disabled: true },
      { label: 'e', text: 'e', type: 'date', times: dates },
    ])
    expect(state.deliveryTime).toBe('e')
    expect(initDeliveryTime(undefined)).toEqual({ deliveryTime: '', selections: {}, activeKeys: {} })
  })

  test('initDeliveryType prefers jd, else first enabled', () => {
    expect(initDeliveryType([{ label: 'x', text: 'x' }, { label: 'jd', text: 'jd' }])).toBe('jd')
    expect(initDeliveryType([{ label: 'x', text: 'x', disabled: true }, { label: 'y', text: 'y' }])).toBe('y')
    expect(initDeliveryType([])).toBe('jd')
  })
})
