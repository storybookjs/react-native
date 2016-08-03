'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _paths = require('../paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add a default custom config which is similar to what React Create App does.
module.exports = function (storybookBaseConfig, configType) {
  var newConfig = storybookBaseConfig;
  newConfig.module.loaders = [].concat((0, _toConsumableArray3.default)(newConfig.module.loaders), [{
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
  }]);

  newConfig.postcss = function () {
    return [_autoprefixer2.default];
  };

  // Return the altered config
  return newConfig;
};