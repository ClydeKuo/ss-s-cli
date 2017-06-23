#!/usr/bin/env node

// const shell = require('shelljs')
const cmd = require('./util/cmd.js')
// const program = require('commander')
// const _DIR = process.cwd()

cmd.exec('git fetch --tags')
