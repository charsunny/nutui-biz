// demo 用的模拟数据 (原 data.js, 图片地址补全 https)
import type { SkuGoods } from './skuHeader'
import type { SkuId, SkuSpec } from './utils'

export const demoSku: SkuSpec[] = [
  {
    id: 1,
    name: '颜色',
    list: [
      { name: '亮黑色', id: 100016015112, active: true, disable: false },
      { name: '釉白色', id: 100016015142, active: false, disable: false },
      { name: '秘银色', id: 100016015078, active: false, disable: false },
      { name: '夏日胡杨', id: 100009064831, active: false, disable: false },
      { name: '秋日胡杨', id: 100009064830, active: false, disable: false },
    ],
  },
  {
    id: 2,
    name: '版本',
    list: [
      { name: '8GB+128GB', id: 100016015102, active: true, disable: false },
      { name: '8GB+256GB', id: 100016015122, active: false, disable: false },
    ],
  },
  {
    id: 3,
    name: '版本',
    list: [
      { name: '4G（有充版）', id: 100016015103, active: true, disable: false },
      { name: '5G（有充版）', id: 100016015123, active: false, disable: false },
      { name: '5G（无充版）', id: 100016015104, active: false, disable: true },
      { name: '5G（无充）质保换新版', id: 100016015125, active: false, disable: false },
    ],
  },
]

export const demoGoods: SkuGoods = {
  skuId: '100016015112',
  price: '4599.00',
  imagePath:
    'https://img14.360buyimg.com/n4/jfs/t1/216079/14/3895/201095/618a5c0cEe0b9e2ba/cf5b98fb6128a09e.jpg',
}

export const demoImagePathMap: Record<string, string> = {
  100016015112:
    'https://img14.360buyimg.com/n4/jfs/t1/216079/14/3895/201095/618a5c0cEe0b9e2ba/cf5b98fb6128a09e.jpg',
  100016015142:
    'https://img14.360buyimg.com/n4/jfs/t1/216079/14/3895/201095/618a5c0cEe0b9e2ba/cf5b98fb6128a09e.jpg',
  100016015078:
    'https://img14.360buyimg.com/n4/jfs/t1/215845/12/3788/221990/618a5c4dEc71cb4c7/7bd6eb8d17830991.jpg',
  100009064831:
    'https://img14.360buyimg.com/n4/jfs/t1/203247/8/14659/237368/618a5c87Ecc968774/b0bb25331e5e2d1a.jpg',
  100009064830:
    'https://img14.360buyimg.com/n4/jfs/t1/160950/40/25098/234168/618a5cb9E65ba975e/7f8f93ea7767a51b.jpg',
}

/** 可售组合 (颜色 × 内存 × 网络), 用于「规格联动」示例 */
export const demoCombos: SkuId[][] = [
  [100016015112, 100016015102, 100016015103],
  [100016015112, 100016015122, 100016015123],
  [100016015142, 100016015102, 100016015103],
  [100016015142, 100016015102, 100016015125],
  [100016015078, 100016015122, 100016015123],
  [100016015078, 100016015122, 100016015104],
  [100009064831, 100016015102, 100016015103],
]
