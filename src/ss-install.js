#!/usr/bin/env node

const cmd = require('./util/cmd.js')
const config = require('./config/index.js')

let argv = process.argv

argv.shift()
argv.shift()

cmd.exec(`npm i --registry=${config.registry} ${argv.join(' ')}`)
