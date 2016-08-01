'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _paths = require('./paths');

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [_path2.default.resolve(__dirname, '../client/manager')],
    preview: [_path2.default.resolve(__dirname, './error_enhancements'), 'webpack-hot-middleware/client?noInfo=true']
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
      loader: 'babel',
      query: require('./babel.js'),
      include: _paths.includePaths
    }, {
      test: /\.css?$/,
      include: _paths.includePaths,
      loader: 'style!css!postcss'
    }, {
      test: /\.json$/,
      include: _paths.includePaths,
      loader: 'json'
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: _paths.includePaths,
      loader: 'file',
      query: {
        name: 'static/media/[name].[ext]'
      }
    }, {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: _paths.includePaths,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'static/media/[name].[ext]'
      }
    }]
  },
  postcss: function postcss() {
    return [_autoprefixer2.default];
  }
};

exports.default = config;