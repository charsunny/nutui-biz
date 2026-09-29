import { View, Text } from '@tarojs/components'
import { Toast } from '@nutui/nutui-react-taro'
import { Cart, Service, Store } from '@nutui/icons-react-taro'
import { CartBar } from './index'
import { CartBarIcon } from '../cartbaricon'
import { CartBarButton } from '../cartbarbutton'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'
import '@nutui/nutui-react-taro/dist/es/packages/toast/style/css'

const toast = (content: string) => Toast.show('cartbar-demo', { content })

// 返回 Fragment (不要包成组件), CartBar 才能识别出其中的 CartBarButton
const renderButtons = () => (
  <>
    <CartBarButton
      text="加入购物车"
      buttonProps={{ type: 'warning' }}
      onClick={() => toast('加入购物车')}
    />
    <CartBarButton
      text="立即购买"
      buttonProps={{ type: 'primary' }}
      onClick={() => toast('立即购买')}
    />
  </>
)

const CartBarDemo = () => {
  return (
    <DemoPage>
      <DemoBlock title="基本用法">
        <CartBar fixed={false}>
          <CartBarIcon text="店铺" icon={<Store />} onClick={() => toast('店铺')} />
          <CartBarIcon text="购物车" icon={<Cart />} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="带有徽标">
        <CartBar fixed={false}>
          <CartBarIcon text="店铺" icon={<Store />} badgeProps={{ value: 10 }} />
          <CartBarIcon text="购物车" icon={<Cart />} badgeProps={{ dot: true }} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="自定义图标颜色">
        <CartBar fixed={false}>
          <CartBarIcon text="店铺" icon={<Store color="#ff0f23" />} />
          <CartBarIcon text="购物车" icon={<Cart />} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="图标无文本">
        <CartBar fixed={false}>
          <CartBarIcon icon={<Store />} />
          <CartBarIcon icon={<Cart />} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="胶囊型按钮">
        <CartBar fixed={false} hasCapsuleButtons>
          <CartBarIcon text="客服" icon={<Service />} />
          <CartBarIcon text="店铺" icon={<Store />} />
          <CartBarIcon text="购物车" icon={<Cart />} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="顶部自定义内容">
        <CartBar
          fixed={false}
          top={
            <View
              style={{
                display: 'flex',
                height: '30px',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff7e6',
              }}
            >
              <Text style={{ fontSize: '12px', color: '#ff8200' }}>我是自定义内容！</Text>
            </View>
          }
        >
          <CartBarIcon text="店铺" icon={<Store />} />
          <CartBarIcon text="购物车" icon={<Cart />} />
          {renderButtons()}
        </CartBar>
      </DemoBlock>
      <DemoBlock title="固定在底部 (带占位)">
        <View style={{ padding: '12px', fontSize: '12px', color: '#888b94' }}>
          页面底部的购物车栏, placeholder 会在原位置生成等高占位, 避免遮挡页面内容。
        </View>
      </DemoBlock>
      <CartBar placeholder hasCapsuleButtons>
        <CartBarIcon text="店铺" icon={<Store />} badgeProps={{ value: 3 }} />
        <CartBarIcon text="购物车" icon={<Cart />} />
        {renderButtons()}
      </CartBar>
      <Toast id="cartbar-demo" />
    </DemoPage>
  )
}

export default CartBarDemo
