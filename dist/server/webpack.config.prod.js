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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = {
  preview: [],
  manager: [_path2.default.resolve(__dirname, '../client/manager')]
};

var config = {
  bail: true,
  devtool: '#cheap-module-source-map',
  entry: entries,
  output: {
    filename: 'static/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), new _webpack2.default.optimize.OccurrenceOrderPlugin(), new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
    compress: {
      screw_ie8: true,
      warnings: false
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    }
  })],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: require('./babel.prod.js'),
      include: _paths.includePaths
    }, {
      test: /\.css$/,
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