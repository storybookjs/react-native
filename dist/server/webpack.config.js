'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['stack-source-map/register', 'webpack-hot-middleware/client', path.resolve(__dirname, '../client/init_ui'), './.paper.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [new webpack.optimize.OccurenceOrderPlugin(), new webpack.HotModuleReplacementPlugin()],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015', 'stage-2'] },
      exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
      include: [path.resolve('./'), __dirname]
    }]
  }
};