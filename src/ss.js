#!/usr/bin/env node

const program = require('commander')

program
  .version(require('../package.json').version)
  .command('install', '安装依赖')
  .command('update', '更新依赖')
  .command('lint', '格式化&&eslint')
  .command('tag', 'tag处理')
  .command('start', '启动服务 compile-pre => start')
  .command('build', '构建 compile-pre -> compile -> compile-post')
  .command('pack', '打包 update -> lint -> build -> tag -> push')
  .command('compile-pre', '编译前置钩子')
  .command('compile', '编译处理钩子')
  .command('compile-post', '编译后置钩子')
  .command('init', '生成模板')
  .parse(process.argv)
