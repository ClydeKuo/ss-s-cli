#!/usr/bin/env node

// const shell = require('shelljs')
const cmd = require('./util/cmd.js')
const program = require('commander')
// const _DIR = process.cwd()

let envs = []

program
    .arguments('[env...]')
    .action(val => {
      envs = val
    })
    .parse(process.argv)

if (!envs.length) {
  cmd.error('请输入要编译的环境变量,多个环境以逗号分隔 ss build [环境名,环境名]')
}

cmd.log('============ compile ============')

for (let env of envs) {
  cmd.exec(`ss compile-pre ${env}`)
  cmd.exec(`ss compile ${env}`)
  cmd.exec(`ss compile-post ${env}`)
}

cmd.log('============ end ============')
