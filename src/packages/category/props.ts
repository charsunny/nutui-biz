/** 三级分类 */
export interface CategoryPaneItem {
  backImg?: string
  catId: string | number
  catName: string
  [key: string]: any
}

/** 二级分类 (右侧的一个分区) */
export interface CategoryPaneData {
  catId: string | number
  catName: string
  children?: CategoryPaneItem[]
  [key: string]: any
}

/** 一级分类 (左侧导航项) */
export interface CategoryData {
  catId: string | number
  catName: string
  children?: CategoryPaneData[]
  [key: string]: any
}
