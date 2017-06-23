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

env = env || 'dev-server'

if (!shell.test('-f', `${_DIR}/build/webpack.config.${env}.js`)) {
  cmd.error(`找不到文件：${_DIR}/build/webpack.config.${env}.js`)
}

cmd.exec(`ss compile-pre ${env}`)

const WebpackDevServer = require('webpack-dev-server')
const Webpack = require('webpack')
const webpackConfig = require(`${_DIR}/build/webpack.config.${env}.js`)
const serverConfig = require(`${_DIR}/build/server.config.json`)

webpackConfig.entry.bootstrap.unshift(`webpack-dev-server/client?http://${serverConfig.host}/`, 'webpack/hot/dev-server')
webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin())
webpackConfig.output.filename = '[name].[hash].js'

let server = new WebpackDevServer(Webpack(webpackConfig), {
    // hot: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: {
    chunks: false, // Makes the build much quieter
    colors: true
  },
  historyApiFallback: true
})
server.listen(serverConfig.port, 'localhost', () => {
  console.log(`正  在  编  译  中  ...  片  刻  后  可  访  问  http://${serverConfig.host}`)
})
