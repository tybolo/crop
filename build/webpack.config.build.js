var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

var webpackBaseCfg = require('./webpack.config.base.js')
var webpackBuildCfg = Object.assign({}, webpackBaseCfg, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash].js'
  },
  plugins: webpackBaseCfg.plugins.concat([
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      "verbose": true, // Write logs to console.
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: path.resolve(__dirname, '../index.html'),
      inject: 'body',
      chunks: ['vendor', 'app']
    }),
    new UglifyJsPlugin({compress: {warnings: false}})
  ])
})

module.exports = webpackBuildCfg
