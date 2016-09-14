'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _WatchMissingNodeModulesPlugin = require('./WatchMissingNodeModulesPlugin');

var _WatchMissingNodeModulesPlugin2 = _interopRequireDefault(_WatchMissingNodeModulesPlugin);

var _utils = require('./utils');

var _babel = require('./babel.js');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [require.resolve('./polyfills'), require.resolve('../../client/manager')],
    preview: [require.resolve('./polyfills'), require.resolve('./error_enhancements'), require.resolve('webpack-hot-middleware/client')]
  },
  output: {
    path: _path2.default.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [new _utils.OccurenceOrderPlugin(), new _webpack2.default.HotModuleReplacementPlugin(), new _caseSensitivePathsWebpackPlugin2.default(), new _WatchMissingNodeModulesPlugin2.default(_utils.nodeModulesPaths)],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: require.resolve('babel-loader'),
      query: _babel2.default,
      include: _utils.includePaths,
      exclude: _utils.excludePaths
    }]
  }
};

exports.default = config;