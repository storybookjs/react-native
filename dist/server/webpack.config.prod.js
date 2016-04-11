'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  devtool: '#cheap-module-source-map',
  entry: {
    admin: [_path2.default.resolve(__dirname, '../client/init_admin')],
    preview: [_path2.default.resolve(__dirname, '../client/init_preview')]
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), new _webpack2.default.optimize.UglifyJsPlugin(), new _webpack2.default.optimize.OccurenceOrderPlugin()],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015', 'stage-2'] },
      exclude: [_path2.default.resolve('./node_modules'), _path2.default.resolve(__dirname, 'node_modules')],
      include: [_path2.default.resolve('./'), __dirname]
    }]
  }
};

exports.default = config;