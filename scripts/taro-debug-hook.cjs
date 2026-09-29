process.on('unhandledRejection', r=>{console.error('REJECT', require('util').inspect(r,{depth:6})); process.exit(1)})
// 用法: node -r ./scripts/taro-debug-hook.cjs node_modules/@tarojs/cli/bin/taro build --type weapp
// Taro 构建失败时只打印 "[object Array]", 这个钩子把真正的 webpack 错误展开。
