// Address 地区选择的纯逻辑 (不依赖 Taro, 便于单测)。
import type {
  AddressList,
  BaseAddressInfo,
  CloseCallBackData,
  ElevatorGroup,
  RegionData,
  RegionKey,
  SelectedRegionObj,
} from './type'

export const REGION_KEYS: RegionKey[] = ['province', 'city', 'country', 'town']

export const emptySelectedRegion = (): SelectedRegionObj => ({
  province: { name: '' },
  city: { name: '' },
  country: { name: '' },
  town: { name: '' },
})

const isSelected = (item?: RegionData) =>
  !!item && item.id !== undefined && item.id !== null && item.id !== ''

/** 参与选择的层级: 省/市/县, 传了乡镇数据时再加上乡镇。 */
export const getLevels = (lists: Pick<BaseAddressInfo, 'town'>): RegionKey[] =>
  lists.town && lists.town.length > 0 ? REGION_KEYS : REGION_KEYS.slice(0, 3)

/** type="elevator" 时按 title 分组并排序, 生成 Elevator 的 list。不修改入参。 */
export const toElevatorGroups = (data: RegionData[]): ElevatorGroup[] => {
  if (!Array.isArray(data) || !data.length) return []
  const groups: ElevatorGroup[] = []
  const sorted = [...data].sort((a, b) =>
    String(a.title ?? '').localeCompare(String(b.title ?? ''))
  )
  sorted.forEach((item) => {
    const title = String(item.title ?? '')
    const group = groups.find((g) => g.title === title)
    if (group) group.list.push(item)
    else groups.push({ title, list: [item] })
  })
  return groups
}

/**
 * 根据 modelSelect (id 数组) 还原已选地区与当前 tab。
 * modelSelect 为空时返回 null (保持现状)。
 */
export const resolveSelection = (
  modelSelect: (string | number)[] | undefined,
  lists: BaseAddressInfo,
  levels: RegionKey[] = getLevels(lists)
): { selected: SelectedRegionObj; tabIndex: number } | null => {
  if (!modelSelect || modelSelect.length === 0) return null
  const selected = emptySelectedRegion()
  let tabIndex = 0
  for (let index = 0; index < modelSelect.length; index++) {
    const key = levels[index]
    if (!key || !lists[key] || lists[key].length === 0) break
    const val = modelSelect[index]
    // eslint-disable-next-line eqeqeq
    if (!val || val == '0') break
    // eslint-disable-next-line eqeqeq
    const found = lists[key].find((item) => item.id == val)
    if (!found) break
    selected[key] = found
    tabIndex = index
  }
  return { selected, tabIndex }
}

/** 在第 tabIndex 级选中 item, 并清空其后各级。 */
export const selectRegionItem = (
  selected: SelectedRegionObj,
  tabIndex: number,
  item: RegionData
): SelectedRegionObj => {
  const next = { ...selected, [REGION_KEYS[tabIndex]]: item }
  REGION_KEYS.forEach((key, i) => {
    if (i > tabIndex) next[key] = { name: '' }
  })
  return next
}

/** 切回第 index 级 tab 时, 清空其后各级。 */
export const resetRegionsAfter = (
  selected: SelectedRegionObj,
  index: number
): SelectedRegionObj => {
  const next = { ...selected }
  REGION_KEYS.forEach((key, i) => {
    if (i > index) next[key] = { name: '' }
  })
  return next
}

/** 点击第 tabIndex 级后, 下一级的 key (已是第 4 级时为 '')。 */
export const nextRegionKey = (tabIndex: number): RegionKey | '' =>
  REGION_KEYS[tabIndex + 1] ?? ''

/** 是否还有下一级 tab 可切换。 */
export const canAdvance = (tabIndex: number, levels: RegionKey[]) =>
  tabIndex + 1 < levels.length

/** 第 index 级 tab 的文案: 已选显示名称, 未选显示 placeholder。 */
export const regionTabLabel = (item: RegionData | undefined, placeholder: string) =>
  isSelected(item) && item?.name ? String(item.name) : placeholder

/** onClose 回调里的地区结果: addressIdStr 形如 `1_7_3_0`, addressStr 为名称拼接。 */
export const buildRegionResult = (selected: SelectedRegionObj): CloseCallBackData => ({
  ...selected,
  addressIdStr: REGION_KEYS.map((key) => selected[key]?.id || 0).join('_'),
  addressStr: REGION_KEYS.map((key) => selected[key]?.name || '').join(''),
})

/** `1_7_3_0` → [1, 7, 3]: 取到第一个 0 为止; 非数字 id 原样保留为字符串。 */
export const parseRegionIds = (addressIdStr: string | undefined): (number | string)[] => {
  if (!addressIdStr) return []
  const ids: (number | string)[] = []
  for (const part of addressIdStr.split('_')) {
    if (!part || part === '0') break
    const n = Number(part)
    ids.push(Number.isNaN(n) ? part : n)
  }
  return ids
}

/** 已有地址的完整文案 */
export const formatExistAddress = (item: AddressList) =>
  [item.provinceName, item.cityName, item.countyName, item.townName, item.addressDetail]
    .filter(Boolean)
    .join('')

const EMPTY_EXIST: AddressList = {
  provinceName: '',
  cityName: '',
  countyName: '',
  townName: '',
  addressDetail: '',
  selectedAddress: false,
}

/**
 * 选中已有地址: 返回选中前的地址、选中的地址与新的列表 (只有 item 的 selectedAddress 为 true)。
 * 不修改入参。
 */
export const selectExistAddress = (list: AddressList[], index: number) => {
  const prev = list.find((i) => i && i.selectedAddress) ?? EMPTY_EXIST
  const next = list.map((i, idx) => ({ ...i, selectedAddress: idx === index }))
  return { prev, item: next[index], list: next }
}
