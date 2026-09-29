import path from 'path'
import { defineConfig } from '@tarojs/cli'

const librarySrc = path.resolve(__dirname, '..', 'src')

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
    'nutui-biz-taro': librarySrc,
  },
  mini: {
    // 库源码在 sourceRoot 之外: 用 compile.include 让它走 Taro 自己的脚本编译链
    // (自己加 babel-loader 规则会漏掉 H5 的 Taro API 转换, createSelectorQuery 等在 H5 上变成 undefined)
    compile: { include: [librarySrc] },
    postcss: { pxtransform: { enable: true, config: {} } },
    webpackChain(chain) {
      applyChain(chain)
    },
  },
  h5: {
    compile: { include: [librarySrc] },
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
}
