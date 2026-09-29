import { useState } from 'react'
import type { CSSProperties } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { More } from '@nutui/icons-react-taro'
import { HorizontalScrolling } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'

const imgUrl =
  'https://img13.360buyimg.com/imagetools/s140x140_jfs/t1/209493/27/20842/369749/6260d2eeE02eb253c/97386232ecf1c1ef.jpg'

const rowStyle: CSSProperties = { padding: '12px 0 12px 12px' }
const rowLeftStyle: CSSProperties = { padding: '12px 12px 12px 0' }

const Items = () => (
  <>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <View className="nb-horizontalscrolling__contain-item" key={item}>
        <Image src={imgUrl} style={{ width: '83px', height: '83px', display: 'block' }} />
      </View>
    ))}
  </>
)

const HorizontalScrollingDemo = () => {
  const [events, setEvents] = useState({ mask: 0, right: 0, left: 0 })

  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <View style={rowStyle}>
          <HorizontalScrolling className="hs-demo-basic">
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="遮罩层位置">
        <View style={rowLeftStyle}>
          <HorizontalScrolling maskPosition="left">
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="遮罩层阴影样式">
        <View style={rowLeftStyle}>
          <HorizontalScrolling
            maskPosition="left"
            maskShadowType="shadow"
            icon={<More size={26} color="#fa2c19" />}
          >
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="遮罩层半透明阴影样式">
        <View style={rowStyle}>
          <HorizontalScrolling
            maskShadowType="transparent"
            maskWidth="50px"
            maskDistance="10px"
            maskContent={
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <View style={{ fontSize: '16px', color: '#000' }}>
                  <Text style={{ fontSize: '12px' }}>￥</Text>199
                </View>
                <Text style={{ fontSize: '12px', color: '#4e4e4f' }}>共3件</Text>
              </View>
            }
          >
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="自定义遮罩内容">
        <View style={rowLeftStyle}>
          <HorizontalScrolling
            maskShadowType="shadow"
            maskPosition="left"
            maskWidth="40px"
            maskContent={
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '14px',
                }}
              >
                查看更多
              </View>
            }
          >
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="无遮罩">
        <View style={{ padding: '12px' }}>
          <HorizontalScrolling showMask={false} maskPosition="left">
            <Items />
          </HorizontalScrolling>
        </View>
      </DemoBlock>

      <DemoBlock title="事件演示">
        <View style={rowStyle}>
          <HorizontalScrolling
            className="hs-demo-events"
            maskShadowType="shadow"
            onClickMask={() => setEvents((e) => ({ ...e, mask: e.mask + 1 }))}
            onScrollRight={() => setEvents((e) => ({ ...e, right: e.right + 1 }))}
            onScrollChange={(left) => setEvents((e) => ({ ...e, left: Math.round(left) }))}
          >
            <Items />
          </HorizontalScrolling>
        </View>
        <View style={{ padding: '0 12px 12px' }}>
          <Text className="hs-demo-log" style={{ fontSize: '12px', color: '#999' }}>
            {`点击遮罩 ${events.mask} 次 / 滚动到右侧 ${events.right} 次 / scrollLeft ${events.left}`}
          </Text>
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default HorizontalScrollingDemo
