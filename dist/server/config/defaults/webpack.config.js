'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _paths = require('../paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add a default custom config which is similar to what React Create App does.
module.exports = function (storybookBaseConfig) {
  var newConfig = storybookBaseConfig;
  newConfig.module.loaders = [].concat((0, _toConsumableArray3.default)(newConfig.module.loaders), [{
    test: /\.css?$/,
    include: _paths.includePaths,
    loaders: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('postcss-loader')]
  }, {
    test: /\.json$/,
    include: _paths.includePaths,
    loader: require.resolve('json-loader')
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
    include: _paths.includePaths,
    loader: require.resolve('file-loader'),
    query: {
      name: 'static/media/[name].[ext]'
    }
  }, {
    test: /\.(mp4|webm)(\?.*)?$/,
    include: _paths.includePaths,
    loader: require.resolve('url-loader'),
    query: {
      limit: 10000,
      name: 'static/media/[name].[ext]'
    }
  }]);

  newConfig.postcss = function () {
    return [_autoprefixer2.default];
  };

  newConfig.resolve = {
    // These are the reasonable defaults supported by the Node ecosystem.
    extensions: ['.js', '.json', ''],
    alias: {
      // This is to support NPM2
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
    }
  };

  // Return the altered config
  return newConfig;
};