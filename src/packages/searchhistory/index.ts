import '@nutui/nutui-react-taro/dist/es/packages/searchbar/style/css'
import './searchhistory.scss'

export { SearchHistory } from './searchhistory'
export type { SearchHistoryProps, SearchHistoryDeleteType, IsearchItem } from './searchhistory'
export { addSearchHistory, addSearchKeyword, removeSearchHistory } from './utils'
export { SearchHistory as default } from './searchhistory'
