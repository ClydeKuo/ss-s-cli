#!/usr/bin/env node

const recursive = require('recursive-readdir')
const vuefix = require('./lintfix/index.js')
const shell = require('shelljs')
const cmd = require('./util/cmd.js')
const program = require('commander')
// const _DIR = process.cwd()

program
    .option('-S, --source [type]', '源目录')
    .option('-C, --commit', '暂存区 检测')
    .option('-w, --work', '工作区&&暂存区 检测')
    .parse(process.argv)

program.source = program.source || 'src' // npm run script 会忽略 -param 传参数，所以在这里给默认值

// Added (A), Copied (C), Deleted (D), Modified (M), Renamed (R), changed (T), Unmerged (U), Unknown (X), Broken (B)
if (program.commit) {
  let files = shell.exec('git diff --cached --name-only --diff-filter=ACMR', {silent: true}).stdout.split('\n')
  vuefix(files, () => cmd.exec('git add -A'))
} else if (program.work) {
  // todo 工作区&&暂存区 检测
  // let files = shell.exec('git diff --cached --name-only --diff-filter=ACM', {silent: true}).stdout.split('\n')
  // vuefix(files)
  // cmd.exec('git add -A')
} else {
  if (shell.test('-d', program.source)) { // 当没有src目录时会报错，加个判断修复
    recursive(program.source, [''], (err, files) => {
      if (err) {
        console.log(err)
        process.exit(1)
      }
      vuefix(files)
    })
  }
}
