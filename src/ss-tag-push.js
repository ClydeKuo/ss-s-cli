#!/usr/bin/env node

// const shell = require('shelljs')
const cmd = require('./util/cmd.js')
const program = require('commander')
// const _DIR = process.cwd()

let tag = ''

program
  .arguments('[tag]')
  .action(val => {
    tag = val
  })
  .parse(process.argv)

if (!tag) {
  // 检测是否输入tag
  cmd.error('Pleae enter tag value! tag push [tag]')
  process.exit(1)
}

cmd.exec(`git push origin ${tag}`)
