#!/usr/bin/env node

const shell = require('shelljs')
const ora = require('ora')
const chalk = require('chalk')

module.exports = {
  error (str, code = 1) {
    console.log(chalk.red(str))
    process.exit(code)
  },
  log (str) {
    console.log(chalk.yellow(str))
  },
  exec (cmd, opt) {
    let rs = shell.exec(cmd, opt)
    if (rs.code !== 0) {
      console.log(rs)
      process.exit(1)
    } else {
      return rs.stdout
    }
  },
  batch (cmds) {
    let spinner = ora()
    let stack = () => {}
    for (let cmd of cmds) {
      stack = (function (next, cmd) {
        return () => {
          if (typeof cmd === 'function') {
            cmd()
            next()
          } else {
            spinner.start(cmd)
            shell.exec(
                            cmd, {
                              async: true
                            },
                            (code, stdout, stderr) => {
                              if (!stderr) {
                                spinner.succeed(`end ok!!! ${cmd}`)
                                next()
                              }
                            }
                        )
          }
        }
      })(stack, cmd)
    }
    stack()
  }
}
