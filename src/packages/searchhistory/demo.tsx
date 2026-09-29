import { useState } from 'react'
import { getStorageSync, setStorageSync } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Toast } from '@nutui/nutui-react-taro'
import { DelF, PlayDoubleBack } from '@nutui/icons-react-taro'
import { SearchHistory, addSearchKeyword, removeSearchHistory } from './index'
import type { IsearchItem } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const STORAGE_KEY = 'nb-demo-recentSearchData'

const readHistory = (): IsearchItem[] => {
  try {
    const list = getStorageSync(STORAGE_KEY)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const searchDiscoverData: IsearchItem[] = [
  { key: '小米手环', url: '' },
  { key: '对讲机', url: '' },
]

const SearchHistoryDemo = () => {
  const [recentSearchData, setRecentSearchData] = useState<IsearchItem[]>(() => {
    const list = readHistory()
    return list.length ? list : [{ key: '手机', url: '' }, { key: '耳机', url: '' }, { key: '笔记本电脑', url: '' }]
  })

  const save = (list: IsearchItem[]) => {
    setStorageSync(STORAGE_KEY, list)
    setRecentSearchData(list)
  }

  const common = {
    recentSearchData,
    searchDiscoverData,
    onClickSearchButton: (val: string) => save(addSearchKeyword(recentSearchData, val)),
    onDelete: () => save([]),
    onClickSearchItem: (item: IsearchItem) => console.log('点击搜索项', item),
  }

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <SearchHistory {...common} />
      </DemoBlock>
      <DemoBlock title="单个删除">
        <View className="demo-sh-single">
          <SearchHistory
            {...common}
            deleteType="single"
            onDeleteSingle={(item) => save(removeSearchHistory(recentSearchData, item))}
          />
        </View>
      </DemoBlock>
      <DemoBlock title="自定义标题文案">
        <SearchHistory {...common} recentSearchText="搜索历史" searchDiscoverText="猜你想搜" />
      </DemoBlock>
      <DemoBlock title="自定义返回和删除图标">
        <SearchHistory {...common} backIcon={<PlayDoubleBack size={16} />} deleteIcon={<DelF size={16} />} />
      </DemoBlock>
      <DemoBlock title="自定义 SearchBar">
        <SearchHistory
          {...common}
          leftInIcon={null}
          rightInIcon={null}
          rightOutIcon={
            <View
              style={{
                background: '#ff0f23',
                padding: '6px',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '14px',
              }}
            >
              搜索
            </View>
          }
        />
      </DemoBlock>
      <DemoBlock title="添加搜索发现额外信息">
        <SearchHistory
          {...common}
          searchDiscoverExtra={
            <Text style={{ color: '#888b94', fontSize: '12px', marginLeft: '10px', fontWeight: 'normal' }}>
              十亿商品，搜啥都有
            </Text>
          }
        />
      </DemoBlock>
      <DemoBlock title="隐藏时不展示无数据文案">
        <SearchHistory {...common} noDiscoverDataText="" />
      </DemoBlock>
      <DemoBlock title="刷新数据">
        <SearchHistory
          {...common}
          onRefresh={() => Toast.show('nb-demo-search-history-toast', { content: '点击了刷新按钮' })}
        />
      </DemoBlock>
      <Toast id="nb-demo-search-history-toast" />
    </DemoPage>
  )
}

export default SearchHistoryDemo
