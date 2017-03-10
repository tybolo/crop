var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

var webpackBaseCfg = require('./webpack.config.base.js')
var webpackBuildCfg = Object.create(webpackBaseCfg)

webpackBuildCfg.output = {
  path: path.resolve(__dirname, '../dist'),
  filename: 'js/[name].[hash].js'
}

webpackBuildCfg.plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: path.resolve(__dirname, '../index.html'),
    inject: 'body',
    chunks: ['vendor', 'app']
  }),
  new CommonsChunkPlugin('vendor'),
  new ExtractTextPlugin('css/[name].[hash].css'),
  new UglifyJsPlugin({compress: {warnings: false}})
]

module.exports = webpackBuildCfg
