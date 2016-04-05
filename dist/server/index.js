#!/usr/bin/env node
'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _webpack3 = require('./webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'production';

var logger = console;

_commander2.default.version(_package2.default.version).option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt).option('-s, --static-dir [dir-name]', 'Directory where to load static files from').option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').parse(process.argv);

if (!_commander2.default.port) {
  logger.error('Error: port to run Storybook is required!\n');
  _commander2.default.help();
  process.exit(-1);
}

var app = (0, _express2.default)();

if (_commander2.default.staticDir) {
  var staticPath = _path2.default.resolve(_commander2.default.staticDir);
  if (_fs2.default.existsSync(staticPath)) {
    logger.log('=> Loading static files from: ' + staticPath + ' .');
    app.use(_express2.default.static(staticPath));
  } else {
    logger.error('Error: no such directory to load static files: ' + staticPath);
    process.exit(-1);
  }
}

// add config path to the entry
var configDir = _commander2.default.configDir || './.storybook';
var configDirPath = _path2.default.resolve(configDir);

// load babelrc file.
var babelrcPath = _path2.default.resolve('./.babelrc');
if (_fs2.default.existsSync(babelrcPath)) {
  logger.info('=> Using custom .babelrc configurations.');
  var babelrcContent = _fs2.default.readFileSync(babelrcPath);
  try {
    var babelrc = JSON.parse(babelrcContent);
    _webpack4.default.module.loaders[0].query = babelrc;
  } catch (ex) {
    logger.error('=> Error parsing .babelrc file: ' + ex.message);
    throw ex;
  }
}

var storybookConfigPath = _path2.default.resolve(configDirPath, 'config.js');
if (!_fs2.default.existsSync(storybookConfigPath)) {
  logger.error('=> Create a storybook config file in "' + configDir + '/config.js".\n');
  process.exit(0);
}
_webpack4.default.entry.preview.push(storybookConfigPath);

// load custom webpack configurations
var customConfigPath = _path2.default.resolve(configDirPath, 'webpack.config.js');
if (_fs2.default.existsSync(customConfigPath)) {
  var customConfig = require(customConfigPath);
  if (customConfig.module.loaders) {
    logger.info('=> Loading custom webpack loaders.');
    _webpack4.default.module.loaders = _webpack4.default.module.loaders.concat(customConfig.module.loaders);
  }

  if (customConfig.plugins) {
    logger.info(' => Loading custom webpack plugins.');
    _webpack4.default.plugins = _webpack4.default.plugins.concat(customConfig.plugins);
  }
}

var compiler = (0, _webpack2.default)(_webpack4.default);
var devMiddlewareOptions = {
  noInfo: true,
  publicPath: _webpack4.default.output.publicPath
};
app.use((0, _webpackDevMiddleware2.default)(compiler, devMiddlewareOptions));
app.use((0, _webpackHotMiddleware2.default)(compiler));

app.get('/', function (req, res) {
  res.send((0, _index2.default)());
});

app.get('/iframe', function (req, res) {
  res.send((0, _iframe2.default)());
});

app.listen(_commander2.default.port, function (error) {
  if (error) {
    throw error;
  } else {
    logger.info('\nReact Storybook started on => http://localhost:' + _commander2.default.port + '/ \n');
  }
});