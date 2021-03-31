#!/usr/bin/env node

const { checkNodeVersion } = require('../lib')
const pkg = require('../package.json')

// check node version
checkNodeVersion(pkg.engines.node, pkg.name)

console.log('avenger', pkg.engines.node, pkg.name)
