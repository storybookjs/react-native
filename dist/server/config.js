'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (baseConfig, configDir) {
  var config = baseConfig;

  // if user has a .babelrc file in current directory
  // use that to extend webpack configurations
  if (_fs2.default.existsSync('./.babelrc')) {
    var content = _fs2.default.readFileSync('./.babelrc');
    try {
      var babelrc = JSON.parse(content);
      config.module.loaders[0].query = babelrc;
    } catch (e) {
      logger.error('=> Error parsing .babelrc file: ' + e.message);
      throw e;
    }
  }

  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  var storybookConfigPath = _path2.default.resolve(configDir, 'config.js');
  if (!_fs2.default.existsSync(storybookConfigPath)) {
    var err = new Error('=> Create a storybook config file in "' + configDir + '/config.js".');
    throw err;
  }
  config.entry.preview.push(storybookConfigPath);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  var customConfigPath = _path2.default.resolve(configDir, 'webpack.config.js');
  if (!_fs2.default.existsSync(customConfigPath)) {
    return config;
  }

  var customConfig = require(customConfigPath);
  logger.info('=> Loading custom webpack config.');

  return (0, _extends3.default)({}, customConfig, config, {
    // We need to use our and custom plugins.
    plugins: [].concat((0, _toConsumableArray3.default)(config.plugins), (0, _toConsumableArray3.default)(customConfig.plugins || [])),
    module: (0, _extends3.default)({}, config.module, {
      // We need to use our and custom loaders.
      loaders: [].concat((0, _toConsumableArray3.default)(config.module.loaders), (0, _toConsumableArray3.default)(customConfig.module.loaders || []))
    })
  });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// avoid ESLint errors
var logger = console;

// `baseConfig` is a webpack configuration bundled with storybook.
// React Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.