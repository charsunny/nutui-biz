// 由 src/config.json 生成:
//   src/index.ts                     全量导出 (入库)
//   demo/app.config.ts, demo/groups.ts   demo 小程序页面表与首页导航 (不入库)
//   demo/pages/<name>/index.tsx      demo 页面入口, 转发到 src/packages/<name>/demo.tsx (不入库)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(fs.readFileSync(path.join(root, 'src/config.json'), 'utf8'))

const packages = config.nav.flatMap((group) =>
  group.packages.map((p) => ({ ...p, group: group.name, dir: p.name.toLowerCase() }))
)

// ---- src/index.ts ----
const exportLines = [
  '// 由 scripts/generate.mjs 生成, 不要手改。',
  '// 业务方请按组件路径引入 (nutui-biz-taro/packages/<name>), 整包引入会带上全部组件样式。',
  '',
]
for (const p of packages) {
  const entry = path.join(root, 'src/packages', p.dir, 'index.ts')
  if (!fs.existsSync(entry)) {
    console.warn(`[generate] 跳过 ${p.name}: 缺少 ${path.relative(root, entry)}`)
    continue
  }
  exportLines.push(`export * from './packages/${p.dir}'`)
}
exportLines.push("export * from './locales/base'", '')
fs.writeFileSync(path.join(root, 'src/index.ts'), exportLines.join('\n'))

// ---- demo pages ----
// ONLY=card,sku 只生成这几个 demo 页 (调试 / 分批验证用)
const only = process.env.ONLY ? process.env.ONLY.toLowerCase().split(',') : null
const demoPages = packages.filter(
  (p) =>
    p.show !== false &&
    (!only || only.includes(p.dir)) &&
    fs.existsSync(path.join(root, 'src/packages', p.dir, 'demo.tsx'))
)
const pagesDir = path.join(root, 'demo/pages')
for (const entry of fs.readdirSync(pagesDir)) {
  if (entry !== 'index') fs.rmSync(path.join(pagesDir, entry), { recursive: true, force: true })
}
for (const p of demoPages) {
  const dir = path.join(pagesDir, p.dir)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'index.tsx'),
    `import Demo from '../../../src/packages/${p.dir}/demo'\n\nexport default Demo\n`
  )
  fs.writeFileSync(
    path.join(dir, 'index.config.ts'),
    `export default definePageConfig({ navigationBarTitleText: '${p.name} ${p.cName}' })\n`
  )
}

const groups = config.nav.map((group) => ({
  name: group.name,
  items: group.packages
    .filter((p) => demoPages.some((d) => d.name === p.name))
    .map((p) => ({ name: p.name, cName: p.cName, path: `/pages/${p.name.toLowerCase()}/index` })),
}))
fs.writeFileSync(
  path.join(root, 'demo/groups.ts'),
  `// 由 scripts/generate.mjs 生成, 不要手改。
export const DEMO_GROUPS = ${JSON.stringify(groups, null, 2)}
`
)
fs.writeFileSync(
  path.join(root, 'demo/app.config.ts'),
  `// 由 scripts/generate.mjs 生成, 不要手改。
export default defineAppConfig({
  pages: ${JSON.stringify(['pages/index/index', ...demoPages.map((p) => `pages/${p.dir}/index`)], null, 2)},
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'NutUI Biz',
    navigationBarTextStyle: 'black',
  },
})
`
)
console.log(`[generate] ${packages.length} 个组件, ${demoPages.length} 个 demo 页`)
