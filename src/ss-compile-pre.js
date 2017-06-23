#!/usr/bin/env node

const shell = require('shelljs')
const cmd = require('./util/cmd.js')
const program = require('commander')
const _DIR = process.cwd()

let env = ''

program
    .arguments('[env]')
    .action(val => {
      env = val
    })
    .parse(process.argv)

if (!env) {
  cmd.error('缺少环境变量 ss compile-pre [环境名]')
}

if (shell.test('-f', `${_DIR}/build/compile-pre.js`)) {
  cmd.exec(`node ${_DIR}/build/compile-pre.js ${env}`)
}
