import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DEMO_GROUPS } from '../../groups'

export default function Index() {
  return (
    <View style={{ padding: '16px' }}>
      <View style={{ padding: '8px 4px 16px' }}>
        <Text style={{ fontSize: '22px', fontWeight: 600 }}>NutUI Biz · Taro</Text>
      </View>
      {DEMO_GROUPS.map((group) => (
        <View key={group.name} style={{ marginBottom: '16px' }}>
          <View style={{ padding: '0 4px 8px' }}>
            <Text style={{ fontSize: '13px', color: '#909ca4' }}>{group.name}</Text>
          </View>
          <View style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            {group.items.map((item) => (
              <View
                key={item.name}
                className={`demo-nav-${item.name.toLowerCase()}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid #f2f3f5',
                }}
                onClick={() => Taro.navigateTo({ url: item.path })}
              >
                <Text style={{ fontSize: '15px' }}>{item.name}</Text>
                <Text style={{ fontSize: '13px', color: '#909ca4' }}>{item.cName}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}
