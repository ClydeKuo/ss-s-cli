#!/usr/bin/env node

// const shell = require('shelljs')
const cmd = require('./util/cmd.js')
const program = require('commander')
// const _DIR = process.cwd()

let regexp = ''

program
    .option('-A, --all', '删除全部tag')
    .arguments('[regexp]')
    .action(val => {
      regexp = val
    })
    .parse(process.argv)

if (program.all) {
    // 删除本地全部tag
  cmd.exec('git tag -l | xargs git tag -d')
  process.exit(0)
}

if (!regexp) {
    // 检测是否输入patterns
  cmd.error('Please enter regexp! tag clear [regexp]')
  process.exit(1)
}

cmd.exec(
    `git show-ref --tag | awk '/(${regexp}.*)/ {print ":"$2}' | xargs git push origin`
)
