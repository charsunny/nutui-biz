import { useMemo } from 'react'
import type { ComponentProps, FunctionComponent } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Elevator } from '@nutui/nutui-react-taro'
import { Check, Loading } from '@nutui/icons-react-taro'
import bem from '../../utils/bem'
import { useConfig } from '../configprovider'
import { REGION_KEYS, regionTabLabel, toElevatorGroups } from './region'
import type { BaseAddressInfo, RegionData, RegionKey, SelectedRegionObj } from './type'

type ElevatorList = NonNullable<ComponentProps<typeof Elevator>['list']>

export interface CustomRenderProps extends BaseAddressInfo {
  type: 'custom' | 'elevator'
  levels: RegionKey[]
  tabIndex: number
  selected: SelectedRegionObj
  height: string | number
  loading: boolean
  /** 最近一次点击的地区, loading 时在它前面显示加载图标 */
  clicked: RegionData | null
  onSelect: (item: RegionData) => void
  onTabClick: (index: number) => void
}

export const CustomRender: FunctionComponent<CustomRenderProps> = (props) => {
  const {
    type,
    levels,
    tabIndex,
    selected,
    height,
    loading,
    clicked,
    onSelect,
    onTabClick,
  } = props
  const { locale } = useConfig()
  const b = bem('address')

  const levelKey = levels[tabIndex] ?? REGION_KEYS[0]
  const currentList: RegionData[] = props[levelKey] || []
  const current = selected[levelKey]
  const isElevator = type === 'elevator'
  const groups = useMemo(
    () => (isElevator ? toElevatorGroups(currentList) : []),
    [isElevator, currentList]
  )

  // eslint-disable-next-line eqeqeq
  const isActive = (item: RegionData) => current?.id !== undefined && current.id == item.id
  // eslint-disable-next-line eqeqeq
  const isClicked = (item: RegionData) => !!clicked && clicked.id == item.id

  const renderItemIcon = (item: RegionData) => {
    if (loading) {
      return isClicked(item) ? (
        <Loading className={b('region-item-loading')} size={13} />
      ) : null
    }
    return isActive(item) ? <Check className={b('region-item-icon')} size={13} /> : null
  }

  const renderItem = (item: RegionData) => (
    <View className={b('region-item', { active: isActive(item) })}>
      {renderItemIcon(item)}
      <Text className={b('region-item-name')}>{item.name}</Text>
    </View>
  )

  return (
    <View className={b('custom')}>
      <View className={b('region-tab')}>
        {levels.map((key, index) =>
          index <= tabIndex ? (
            <View
              key={key}
              className={b('tab-item', { active: index === tabIndex })}
              onClick={() => onTabClick(index)}
            >
              <Text className={b('tab-item-text')}>
                {regionTabLabel(selected[key], locale.select)}
              </Text>
              {index === tabIndex && <View className={b('tab-line')} />}
            </View>
          ) : null
        )}
      </View>

      {!isElevator && (
        <ScrollView key={levelKey} className={b('region-con')} scrollY>
          {currentList.map((item, index) => (
            <View
              key={`${item.id ?? index}`}
              className={b('region-cell')}
              onClick={() => onSelect(item)}
            >
              {renderItem(item)}
            </View>
          ))}
        </ScrollView>
      )}

      {isElevator && (
        <View className={b('elevator-group')}>
          <Elevator
            key={levelKey}
            className={b('elevator')}
            height={height}
            list={groups as unknown as ElevatorList}
            onItemClick={(_key, item) => onSelect(item as RegionData)}
          >
            <Elevator.Context.Consumer>
              {(item) => renderItem(item as RegionData)}
            </Elevator.Context.Consumer>
          </Elevator>
        </View>
      )}
    </View>
  )
}

CustomRender.displayName = 'NbAddressCustomRender'
