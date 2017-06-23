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
  cmd.error('请输入要编译的环境变量 ss build [环境名]')
}

if (!shell.test('-f', `${_DIR}/build/webpack.config.${env}.js`)) {
  cmd.error(`找不到文件：${_DIR}/build/webpack.config.${env}.js`)
}

const webpack = require('webpack')
const webpackConfig = require(`${_DIR}/build/webpack.config.${env}.js`)

// returns a Compiler instance
const compiler = webpack(webpackConfig)
const handleFatalError = function (error) {
  console.log(error)
  process.exit(1)
}
const handleSoftErrors = function (error) {
  console.log(error)
  process.exit(1)
}
const handleWarnings = function (error) {
  console.log(error)
    // process.exit(1)
}

compiler.run((err, stats) => {
  if (err) { return handleFatalError(err) }
  var jsonStats = stats.toJson()
  if (jsonStats.errors.length > 0) { return handleSoftErrors(jsonStats.errors) }
  if (jsonStats.warnings.length > 0) { handleWarnings(jsonStats.warnings) }
  console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true
        })
    )
})
