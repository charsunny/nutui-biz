import type { CSSProperties, ReactNode } from 'react'

export interface IComponent {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}
