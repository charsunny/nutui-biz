import type { PropsWithChildren, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'

/** demo 页里的一个示例分区: 标题 + 内容。 */
export function DemoBlock({
  title,
  children,
  plain,
}: PropsWithChildren<{ title: ReactNode; plain?: boolean }>) {
  return (
    <View style={{ padding: '0 12px 16px' }}>
      <View style={{ padding: '16px 0 8px' }}>
        <Text style={{ fontSize: '14px', color: '#909ca4' }}>{title}</Text>
      </View>
      {plain ? (
        children
      ) : (
        <View style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          {children}
        </View>
      )}
    </View>
  )
}

/** demo 页外壳。 */
export function DemoPage({ children }: PropsWithChildren) {
  return <View style={{ paddingBottom: '40px' }}>{children}</View>
}
