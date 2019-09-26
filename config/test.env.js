'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  PHOENIX: '"http://phoenix.sk.9f.cn"' // 凤凰系统
})
