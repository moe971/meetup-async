var CopyWebpackPlugin = require('copy-webpack-plugin')
var Path = require('path')
var shared = require('./webpack.config.shared')
var webpack = require('webpack')

var outputFolder = Path.resolve(__dirname, 'public')

module.exports = {
  entry: [
    Path.resolve(Path.dirname(require.resolve('webpack-hot-middleware')), 'client'),
    Path.resolve(__dirname, 'src/index.js')
  ],
  output: {
    path: outputFolder,
    publicPath: '/',
    filename: 'app.js'
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'static',
      to: outputFolder
    }]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: shared.getAdjustedBabelOptions() }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: { loader: 'url-loader', options: { limit: 10000 } }
      }
    ]
  },
  devtool: '#inline-source-map'
}
