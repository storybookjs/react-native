'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _paths = require('./paths');

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [require.resolve('./polyfills'), require.resolve('../../client/manager')],
    preview: [require.resolve('./polyfills'), require.resolve('./error_enhancements'), require.resolve('webpack-hot-middleware/client') + '?noInfo=true']
  },
  output: {
    path: _path2.default.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.HotModuleReplacementPlugin(), new _caseSensitivePathsWebpackPlugin2.default()],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: require.resolve('babel-loader'),
      query: require('./babel.js'),
      include: _paths.includePaths,
      exclude: _paths.excludePaths
    }]
  }
};

exports.default = config;