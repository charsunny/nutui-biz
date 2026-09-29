import { useState } from 'react'
import type { CSSProperties } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@nutui/nutui-react-taro'
import '@nutui/nutui-react-taro/dist/es/packages/price/style/css'
import { ProductFeed } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

interface DemoItem {
  id: number
  imgUrl: string
  name: string
  desc: string
  tag: string
  price: string
  label: string
}

const TOTAL = 18
const PAGE_SIZE = 6

const allData: DemoItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  imgUrl:
    'https://img13.360buyimg.com/imagetools/jfs/t1/190855/7/12881/42147/60eb0cabE0c3b7234/d523d551413dc853.png',
  name: `${i + 1}. 我是标题我是标题我是标题我是标题我是标题`,
  desc: '更多买点更多买点',
  tag: i === 3 ? '标签标签' : '',
  price: '388',
  label: '自营',
}))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const boxStyle: CSSProperties = { height: '520px', background: '#eee', padding: '6px 0 0' }
const nameStyle: CSSProperties = {
  marginBottom: '7px',
  fontSize: '14px',
  color: 'rgba(0, 0, 0, 0.85)',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  wordBreak: 'break-all',
} as CSSProperties
const labelStyle: CSSProperties = {
  display: 'inline-block',
  marginRight: '5px',
  padding: '0 2px',
  fontSize: '10px',
  lineHeight: '14px',
  color: '#fff',
  background: 'linear-gradient(135deg, #ff404f 0%, #fa2c19 100%)',
  borderRadius: '2px',
}

const imgTag = (
  <Image
    style={{ width: '63px', height: '16px', display: 'block' }}
    src="https://img12.360buyimg.com/imagetools/jfs/t1/186347/7/7338/1009/60c0806bE0b6c7207/97fd04b48d689ffe.png"
  />
)

const customProductDouble = (item: DemoItem) => (
  <>
    <View style={nameStyle}>{item.name}</View>
    {item.tag && <View style={nameStyle}>{item.tag}</View>}
    <Price price={item.price} size="normal" />
  </>
)

const customProductSingle = (item: DemoItem) => (
  <>
    <View style={nameStyle}>
      <Text style={labelStyle}>{item.label}</Text>
      {item.name}
    </View>
    <View style={{ marginBottom: '10px', fontSize: '12px', color: '#8c8c8c' }}>{item.desc}</View>
    <Price price={item.price} size="normal" />
  </>
)

/** 每个 demo 独立的分页数据 */
const usePagedList = () => {
  const [list, setList] = useState<DemoItem[]>(allData.slice(0, PAGE_SIZE))
  const hasMore = list.length < TOTAL
  const loadMore = async () => {
    await sleep(500)
    setList((prev) => allData.slice(0, prev.length + PAGE_SIZE))
  }
  const refresh = async () => {
    await sleep(1000)
    setList(allData.slice(0, PAGE_SIZE))
  }
  return { list, hasMore, loadMore, refresh }
}

const ProductFeedDemo = () => {
  const [log, setLog] = useState('')
  const double = usePagedList()
  const single = usePagedList()
  const refresh = usePagedList()

  const handleClick = (item: DemoItem, index: number) => setLog(`点击商品 ${item.id} (index ${index})`)
  const handleImageClick = (item: DemoItem, index: number) =>
    setLog(`点击图片 ${item.id} (index ${index})`)

  return (
    <DemoPage>
      <View style={{ padding: '8px 12px 0', minHeight: '20px' }}>
        <Text className="productfeed-demo-log" style={{ fontSize: '12px', color: '#999' }}>
          {log}
        </Text>
      </View>
      <DemoBlock title="双列">
        <View style={boxStyle} className="productfeed-demo-double">
          <ProductFeed
            data={double.list}
            infiniteloadingProps={{ hasMore: double.hasMore, onLoadMore: double.loadMore }}
            customProduct={customProductDouble}
            col={2}
            imgUrl="imgUrl"
            imgWidth="144"
            imgHeight="144"
            imgTag={imgTag}
            onClick={handleClick}
            onImageClick={handleImageClick}
          />
        </View>
      </DemoBlock>
      <DemoBlock title="单列">
        <View style={boxStyle} className="productfeed-demo-single">
          <ProductFeed
            data={single.list}
            infiniteloadingProps={{ hasMore: single.hasMore, onLoadMore: single.loadMore }}
            customProduct={customProductSingle}
            col={1}
            imgUrl="imgUrl"
            imgWidth="100"
            imgHeight="100"
            imgTag={imgTag}
            onClick={handleClick}
            onImageClick={handleImageClick}
          />
        </View>
      </DemoBlock>
      <DemoBlock title="下拉刷新">
        <View style={boxStyle} className="productfeed-demo-refresh">
          <ProductFeed
            data={refresh.list}
            infiniteloadingProps={{
              hasMore: refresh.hasMore,
              pullRefresh: true,
              onLoadMore: refresh.loadMore,
              onRefresh: refresh.refresh,
            }}
            customProduct={customProductDouble}
            col={2}
            imgUrl="imgUrl"
            imgWidth="144"
            imgHeight="144"
            imgTag={imgTag}
            onClick={handleClick}
            onImageClick={handleImageClick}
          />
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default ProductFeedDemo
