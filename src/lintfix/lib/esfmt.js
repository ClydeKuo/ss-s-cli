#!/usr/bin/env node

const eslint = require('eslint')

module.exports = function (input) {
  let cliEngine
  try {
    cliEngine = new eslint.CLIEngine({
      fix: true,
      baseConfig: {
        extends: []
      },
      useEslintrc: false
    })
    return cliEngine.executeOnText(input)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
