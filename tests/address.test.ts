import { describe, expect, test } from 'bun:test'
import {
  buildRegionResult,
  canAdvance,
  emptySelectedRegion,
  formatExistAddress,
  getLevels,
  nextRegionKey,
  parseRegionIds,
  regionTabLabel,
  resetRegionsAfter,
  resolveSelection,
  selectExistAddress,
  selectRegionItem,
  toElevatorGroups,
} from '../src/packages/address/region'

const lists = {
  province: [
    { id: 1, name: '北京', title: 'B' },
    { id: 2, name: '广西', title: 'G' },
  ],
  city: [
    { id: 7, name: '朝阳区', title: 'C' },
    { id: 10, name: '石景山区', title: 'S' },
  ],
  country: [
    { id: 3, name: '八里庄街道', title: 'B' },
    { id: 4, name: '常营乡', title: 'C' },
  ],
  town: [],
}

describe('address/region', () => {
  test('getLevels: town 有数据时才加入第 4 级', () => {
    expect(getLevels({ town: [] })).toEqual(['province', 'city', 'country'])
    expect(getLevels({ town: [{ id: 1 }] })).toEqual(['province', 'city', 'country', 'town'])
  })

  test('toElevatorGroups 按 title 分组排序且不修改入参', () => {
    const data = [
      { id: 1, name: 'z', title: 'Z' },
      { id: 2, name: 'b1', title: 'B' },
      { id: 3, name: 'b2', title: 'B' },
    ]
    const snapshot = JSON.stringify(data)
    const groups = toElevatorGroups(data)
    expect(groups.map((g) => g.title)).toEqual(['B', 'Z'])
    expect(groups[0].list.map((i) => i.id)).toEqual([2, 3])
    expect(JSON.stringify(data)).toBe(snapshot)
    expect(toElevatorGroups([])).toEqual([])
  })

  test('resolveSelection 还原已选地区与 tab', () => {
    expect(resolveSelection([], lists)).toBeNull()

    const full = resolveSelection([1, 7, 3], lists)!
    expect(full.tabIndex).toBe(2)
    expect(full.selected.province.name).toBe('北京')
    expect(full.selected.city.name).toBe('朝阳区')
    expect(full.selected.country.name).toBe('八里庄街道')

    // 遇到 0 停止
    const partial = resolveSelection(['1', '0', '3'], lists)!
    expect(partial.tabIndex).toBe(0)
    expect(partial.selected.city.name).toBe('')

    // 下一级还没数据 (异步加载) 时停在上一级
    const lazy = resolveSelection([1, 7], { ...lists, city: [] })!
    expect(lazy.tabIndex).toBe(0)
    expect(lazy.selected.province.id).toBe(1)

    // 找不到 id
    expect(resolveSelection([99], lists)!.selected.province.name).toBe('')
  })

  test('selectRegionItem 选中并清空后续层级', () => {
    const init = resolveSelection([1, 7, 3], lists)!.selected
    const next = selectRegionItem(init, 0, lists.province[1])
    expect(next.province.id).toBe(2)
    expect(next.city).toEqual({ name: '' })
    expect(next.country).toEqual({ name: '' })
    expect(init.province.id).toBe(1)
  })

  test('resetRegionsAfter 保留当前层级', () => {
    const init = resolveSelection([1, 7, 3], lists)!.selected
    const next = resetRegionsAfter(init, 1)
    expect(next.city.id).toBe(7)
    expect(next.country).toEqual({ name: '' })
  })

  test('nextRegionKey / canAdvance', () => {
    expect(nextRegionKey(0)).toBe('city')
    expect(nextRegionKey(2)).toBe('town')
    expect(nextRegionKey(3)).toBe('')
    const levels = getLevels({ town: [] })
    expect(canAdvance(1, levels)).toBe(true)
    expect(canAdvance(2, levels)).toBe(false)
  })

  test('regionTabLabel', () => {
    expect(regionTabLabel({ id: 1, name: '北京' }, '请选择')).toBe('北京')
    expect(regionTabLabel({ name: '' }, '请选择')).toBe('请选择')
    expect(regionTabLabel(undefined, '请选择')).toBe('请选择')
  })

  test('buildRegionResult / parseRegionIds 互逆', () => {
    const selected = selectRegionItem(emptySelectedRegion(), 0, lists.province[0])
    const res = buildRegionResult({ ...selected, city: lists.city[0] })
    expect(res.addressIdStr).toBe('1_7_0_0')
    expect(res.addressStr).toBe('北京朝阳区')
    expect(parseRegionIds(res.addressIdStr)).toEqual([1, 7])
    expect(parseRegionIds('1_7_3_5')).toEqual([1, 7, 3, 5])
    expect(parseRegionIds('bj_7_0')).toEqual(['bj', 7])
    expect(parseRegionIds('')).toEqual([])
    expect(parseRegionIds(undefined)).toEqual([])
  })

  test('selectExistAddress 返回新列表不修改入参', () => {
    const list = [
      { provinceName: 'A', cityName: '', countyName: '', townName: '', addressDetail: '', selectedAddress: true },
      { provinceName: 'B', cityName: 'b', countyName: '', townName: '', addressDetail: 'x', selectedAddress: false },
    ]
    const res = selectExistAddress(list, 1)
    expect(res.prev.provinceName).toBe('A')
    expect(res.item.provinceName).toBe('B')
    expect(res.list.map((i) => i.selectedAddress)).toEqual([false, true])
    expect(list[0].selectedAddress).toBe(true)
    expect(formatExistAddress(res.item)).toBe('Bbx')

    const none = selectExistAddress(res.list.map((i) => ({ ...i, selectedAddress: false })), 0)
    expect(none.prev.provinceName).toBe('')
  })
})
