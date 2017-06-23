#!/usr/bin/env node

// const shell = require('shelljs')
// const cmd = require('./util/cmd.js')
const program = require('commander')
// const _DIR = process.cwd()

program
  .command('clear', '删除tag')
  .command('fetch', '获取tag')
  .command('push', '提交tag')
  .parse(process.argv)
