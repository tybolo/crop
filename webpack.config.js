var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/App.js'),
    vendor: ['react']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: [' ', '.js'],
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/Index.html'),
      filename: path.resolve(__dirname, 'index.html'),
      inject: true,
      chunks: ['vendor', 'app']
    }),
    new CommonsChunkPlugin('vendor'),
    new UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}