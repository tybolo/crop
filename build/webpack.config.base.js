var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var path = require('path')

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/App.js'),
    vendor: ['react']
  },
  resolve: {
    extensions: [' ', '.js'],
    alias: {
      'src': path.join(__dirname, '../src')
      // 'jquery': __dirname + '/node_modules/jquery/dist/jquery.min.js'
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]']
      }) },
      // { test: /\.(scss|sass)$/, loader: ExtractTextPlugin.extract({
      //   fallback: 'style-loader',
      //   use: ['css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'posecss-loader']
      // }'style', 'css!postcss!sass') }
    ]
  },
  // postcss: [ autoprefixer({ browsers: ['last 4 versions', '> 10%'] }) ]
}
