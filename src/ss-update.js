#!/usr/bin/env node

// const shell = require('shelljs')
const cmd = require('./util/cmd.js')
    // const program = require('commander')
const _DIR = process.cwd()
const packageInfo = require(`${_DIR}/package.json`)

const ora = require('ora')
const config = require('./config/index.js')

let command1 = `npm outdated --json --registry=${config.registry}\n` // 检查需要更新的包
let command2 = `npm i --registry=${config.registry}` // 更新包
let spinner = ora(command1).start() // 加载动画
let updatePkg = [] // 要更新的包

// 获取过期的包json
let updateJson = JSON.parse(cmd.exec(command1, {
  silent: true
}) || '{}')
for (let i in updateJson) {
  let version = updateJson[i].wanted
  if (version === updateJson[i].current) {
        // is update to date
  } else if (version === 'git') {
    updatePkg.push(i)
  } else {
    updatePkg.push(`${i}@${version}`)
  }
}

// 获取依赖中以git+ssh方式引入的包
if (packageInfo.dependencies) {
  for (let i in packageInfo.dependencies) {
    if (packageInfo.dependencies[i].indexOf('git+ssh') > -1) {
      updatePkg.push(i)
    }
  }
}
if (packageInfo.devDependencies) {
  for (let i in packageInfo.devDependencies) {
    if (packageInfo.devDependencies[i].indexOf('git+ssh') > -1) {
      updatePkg.push(i)
    }
  }
}

updatePkg = Array.from(new Set(updatePkg))// 数组去重

// 如果都为空则提示全部更新完毕
if (!updatePkg.length) {
  spinner.succeed('Already up-to-date!')
  process.exit(0)
}

let date = new Date()
cmd.exec(`${command2} ${updatePkg.join(' ')}`)
spinner.succeed(`end ${(new Date().getTime() - date) / 1000} s`)
