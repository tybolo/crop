var HtmlWebpackPlugin = require('html-webpack-plugin')

var webpackBaseCfg = require('./webpack.config.base.js')
var webpackDevCfg = Object.assign({}, webpackBaseCfg, {
  output: {
    path: __dirname,
    filename: '[name].[hash].js'
  },
  plugins: webpackBaseCfg.plugins.concat([
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['vendor', 'app']
    })
  ])
})

module.exports = webpackDevCfg
