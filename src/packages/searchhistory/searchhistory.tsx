import { useEffect, useState } from 'react'
import type { FunctionComponent, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { SearchBar } from '@nutui/nutui-react-taro'
import {
  ArrowLeft,
  Close,
  Del,
  Eye,
  Marshalling,
  Photograph,
  Refresh,
  Search,
} from '@nutui/icons-react-taro'
import classNames from 'classnames'
import { useConfig } from '../configprovider'
import bem from '../../utils/bem'
import type { IComponent } from '../../utils/typings'
import type { IsearchItem } from './utils'

export type { IsearchItem }

export type SearchHistoryDeleteType = 'all' | 'single'

export interface SearchHistoryProps extends IComponent {
  recentSearchData: IsearchItem[]
  searchDiscoverData: IsearchItem[]
  recentSearchText: string
  searchDiscoverText: string
  /** 搜索框占位文字 */
  placeholder: string
  /** 左侧返回按钮, 传空 (null / '' / false) 不展示 */
  backIcon: ReactNode
  /** 最近搜索删除图标 */
  deleteIcon: ReactNode
  keyword: string
  leftInIcon: ReactNode
  rightOutIcon: ReactNode
  rightInIcon: ReactNode
  searchDiscoverExtra: ReactNode
  openEyeIcon: ReactNode
  closeEyeIcon: ReactNode
  /** 搜索发现刷新图标, 传空不展示 */
  refreshIcon: ReactNode
  noDiscoverDataText: string
  deleteType: SearchHistoryDeleteType
  /** 保留字段, 暂无效果 */
  recentSearchCollapse: boolean
  onClickSearchButton: (value: string) => void
  onClickBackIcon: () => void
  onClickSearchItem: (searchItem: IsearchItem) => void
  onClickRightInIcon: () => void
  onSearchBarChange: (value: string, event?: any) => void
  onDelete: () => void
  onDeleteSingle: (item: IsearchItem) => void
  onRefresh: () => void
}

const EMPTY: IsearchItem[] = []

export const SearchHistory: FunctionComponent<Partial<SearchHistoryProps>> = (props) => {
  const { locale } = useConfig()
  const {
    className,
    style,
    recentSearchText = locale.searchHistory.recentSearchText,
    searchDiscoverText = locale.searchHistory.searchDiscoverText,
    placeholder = locale.searchHistory.placeholder,
    backIcon = <ArrowLeft size={16} />,
    deleteIcon = <Del size={16} />,
    keyword = '',
    recentSearchData = EMPTY,
    searchDiscoverData = EMPTY,
    leftInIcon = <Search size={14} />,
    rightOutIcon = locale.searchHistory.rightOutIcon,
    rightInIcon = <Photograph size={14} />,
    openEyeIcon = <Eye size={16} />,
    closeEyeIcon = <Marshalling size={16} />,
    refreshIcon = <Refresh size={16} />,
    searchDiscoverExtra,
    noDiscoverDataText = locale.searchHistory.noDiscoverDataText,
    deleteType = 'all',
    onClickSearchButton,
    onClickBackIcon,
    onClickSearchItem,
    onClickRightInIcon,
    onSearchBarChange,
    onDelete,
    onDeleteSingle,
    onRefresh,
  } = props

  const b = bem('search-history')
  const [value, setValue] = useState<string>(keyword)
  const [eyeOpened, setEyeOpened] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  const handleSearch = (val: string) => {
    setValue('')
    onClickSearchButton?.(val)
  }

  const handleDelete = () => {
    if (deleteType === 'single' && !deleting) {
      setDeleting(true)
    } else {
      onDelete?.()
    }
  }

  const renderTags = (list: IsearchItem[], recent: boolean) => (
    <View className={b('tags')}>
      {list.map((item, index) => (
        <View
          className={b('tag')}
          key={typeof item.key === 'string' || typeof item.key === 'number' ? item.key : index}
          onClick={() => {
            // 最近搜索处于单个删除状态时, 点击即删除
            if (recent && deleting) onDeleteSingle?.(item)
            else onClickSearchItem?.(item)
          }}
        >
          <Text className={b('tag-text')}>{item.key}</Text>
          {recent && deleting ? <Close className={b('tag-close')} size={10} /> : null}
        </View>
      ))}
    </View>
  )

  const renderRecent = () => (
    <View className={b('recent')}>
      <View className={b('title')}>
        <View className={b('title-text')}>{recentSearchText}</View>
        {deleting ? (
          <View className={b('actions')}>
            <View className={b('action')} onClick={handleDelete}>
              {locale.searchHistory.deleteAll}
            </View>
            <View className={b('divider')}>|</View>
            <View className={b('action')} onClick={() => setDeleting(false)}>
              {locale.searchHistory.finish}
            </View>
          </View>
        ) : (
          <View className={b('icon')} onClick={handleDelete}>
            {deleteIcon}
          </View>
        )}
      </View>
      {renderTags(recentSearchData, true)}
    </View>
  )

  const renderDiscover = () => (
    <View className={b('discover')}>
      <View className={b('title')}>
        <View className={b('title-text')}>
          {searchDiscoverText}
          {searchDiscoverExtra}
        </View>
        <View className={b('icons')}>
          {refreshIcon ? (
            <View className={b('icon', { refresh: true })} onClick={() => onRefresh?.()}>
              {refreshIcon}
            </View>
          ) : null}
          {eyeOpened ? (
            <View className={b('icon')} onClick={() => setEyeOpened(false)}>
              {openEyeIcon}
            </View>
          ) : (
            <View className={b('hidden')}>
              {!noDiscoverDataText ? (
                <View className={b('hidden-text')}>{locale.searchHistory.hidden}</View>
              ) : null}
              <View className={b('icon')} onClick={() => setEyeOpened(true)}>
                {closeEyeIcon}
              </View>
            </View>
          )}
        </View>
      </View>
      {eyeOpened ? renderTags(searchDiscoverData, false) : null}
      {!eyeOpened && noDiscoverDataText ? (
        <View className={b('no-discover-data')}>{noDiscoverDataText}</View>
      ) : null}
    </View>
  )

  return (
    <View className={classNames(b(), className)} style={style}>
      <View className={b('bar')}>
        <SearchBar
          shape="round"
          placeholder={placeholder}
          value={value}
          leftIn={leftInIcon || null}
          rightIn={
            rightInIcon ? (
              <View className={b('bar-icon')} onClick={() => onClickRightInIcon?.()}>
                {rightInIcon}
              </View>
            ) : null
          }
          left={
            backIcon ? (
              <View className={b('bar-icon')} onClick={() => onClickBackIcon?.()}>
                {backIcon}
              </View>
            ) : null
          }
          right={
            <View className={b('bar-right')} onClick={() => handleSearch(value)}>
              {rightOutIcon}
            </View>
          }
          onChange={(val, event) => {
            setValue(val)
            onSearchBarChange?.(val, event)
          }}
          onClear={() => setValue('')}
          onSearch={(val) => handleSearch(val)}
        />
      </View>
      {recentSearchData.length > 0 ? renderRecent() : null}
      {searchDiscoverData.length > 0 ? renderDiscover() : null}
    </View>
  )
}

SearchHistory.displayName = 'NbSearchHistory'
