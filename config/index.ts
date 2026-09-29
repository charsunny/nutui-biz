import path from 'path'
import { defineConfig } from '@tarojs/cli'

// demo 小程序: 库源码在 src/, demo 页面在 demo/ (页面由 scripts/generate.mjs 按 src/config.json 生成)
export default defineConfig<'webpack5'>(() => ({
  projectName: 'nutui-biz-taro-demo',
  date: '2026-9-28',
  designWidth: 375,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 375: 2, 828: 1.81 / 2 },
  sourceRoot: 'demo',
  outputRoot: process.env.OUT_DIR ?? `dist/${process.env.TARO_ENV}`,
  plugins: [],
  logger: { quiet: false, stats: true },
  framework: 'react',
  compiler: { type: 'webpack5', prebundle: { enable: false } },
  cache: { enable: false },
  alias: {
    'nutui-biz-taro': path.resolve(__dirname, '..', 'src'),
  },
  mini: {
    postcss: { pxtransform: { enable: true, config: {} } },
    webpackChain(chain) {
      applyChain(chain)
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: { mode: 'hash' },
    postcss: { autoprefixer: { enable: true, config: {} } },
    webpackChain(chain) {
      applyChain(chain)
    },
  },
}))

function applyChain(chain: any) {
  // Taro 4.2.1 的 webpackbar 传的旧参数会被 webpack 5.108 拒绝, 进度条只是装饰, 去掉
  chain.plugins.delete('webpackbar')
  // 库源码在 sourceRoot 之外, 需要显式走 babel
  chain.module
    .rule('nutui-biz-src')
    .test(/\.tsx?$/)
    .include.add(path.resolve(__dirname, '..', 'src'))
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        [require.resolve('babel-preset-taro'), { framework: 'react', ts: true }],
      ],
    })
}
