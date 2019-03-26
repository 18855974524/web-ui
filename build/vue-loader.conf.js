'use strict'
const utils = require('./utils')
const config = require('../config')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: true // 提取有问题
  }),
  include: [resolve('src')],
  //exclude: [resolve('node_modules')],
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
