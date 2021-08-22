#!/usr/bin/env node
const updater = require('update-notifier')
const { checkNodeVersion, registerCommand } = require('../lib')
const package = require('../package.json')

// 检查 node 版本
checkNodeVersion(package.engines.node, package.name)

// 检查更新
updater({ pkg: package }).notify({ defer: true })

// 注册命令
registerCommand()
