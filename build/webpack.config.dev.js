var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

var webpackBaseCfg = require('./webpack.config.base.js')
var webpackDevCfg = Object.create(webpackBaseCfg)

webpackDevCfg.output = {
  path: __dirname,
  filename: '[name].[hash].js'
}

webpackDevCfg.plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body',
    chunks: ['vendor', 'app']
  }),
  new CommonsChunkPlugin('vendor'),
  new ExtractTextPlugin('[name].[hash].css')
]

module.exports = webpackDevCfg
