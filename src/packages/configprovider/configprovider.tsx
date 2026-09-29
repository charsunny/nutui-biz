import { createContext, useContext, useMemo } from 'react'
import type { CSSProperties, FunctionComponent, ReactNode } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import type { BaseLang } from '../../locales/base'
import zhCN from '../../locales/zh-CN'

/**
 * 主题变量, camelCase 键会转成 CSS 变量:
 *   nbColorPrimary → --nb-color-primary
 *   nutuiColorPrimary → --nutui-color-primary (顺带也能主题化 NutUI)
 */
export type ConfigProviderTheme = Record<string, string>

export interface ConfigProviderProps {
  locale: BaseLang
  theme?: ConfigProviderTheme
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

type ConfigValue = { locale: BaseLang }

export const defaultConfigRef: { current: ConfigValue } = {
  current: { locale: zhCN },
}

export const setDefaultConfig = (config: ConfigValue) => {
  defaultConfigRef.current = config
}

export const getDefaultConfig = () => defaultConfigRef.current

const ConfigContext = createContext<ConfigValue | null>(null)

export const useConfig = (): ConfigValue =>
  useContext(ConfigContext) ?? getDefaultConfig()

const toKebab = (key: string) =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const themeToCssVars = (theme?: ConfigProviderTheme) => {
  const vars: Record<string, string> = {}
  if (!theme) return vars
  Object.keys(theme).forEach((key) => {
    vars[`--${toKebab(key)}`] = theme[key]
  })
  return vars
}

export const ConfigProvider: FunctionComponent<
  Partial<ConfigProviderProps>
> = ({ locale, theme, className, style, children }) => {
  const parent = useConfig()
  const value = useMemo(
    () => ({ ...parent, ...(locale ? { locale } : {}) }),
    [parent, locale]
  )
  const cssVars = useMemo(() => themeToCssVars(theme), [theme])

  return (
    <ConfigContext.Provider value={value}>
      <View
        className={classNames('nb-configprovider', className)}
        style={{ ...cssVars, ...style }}
      >
        {children}
      </View>
    </ConfigContext.Provider>
  )
}

ConfigProvider.displayName = 'NbConfigProvider'
