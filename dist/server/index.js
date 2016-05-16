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

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = console;

_commander2.default.version(_package2.default.version).option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt).option('-h, --host [string]', 'Host to run Storybook').option('-s, --static-dir [dir-name]', 'Directory where to load static files from').option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').parse(process.argv);

if (!_commander2.default.port) {
  logger.error('Error: port to run Storybook is required!\n');
  _commander2.default.help();
  process.exit(-1);
}

// Used with `app.listen` below
var listenAddr = [_commander2.default.port];

if (_commander2.default.host) {
  listenAddr.push(_commander2.default.host);
}

var app = (0, _express2.default)();

if (_commander2.default.staticDir) {
  var staticPath = _path2.default.resolve(_commander2.default.staticDir);
  if (_fs2.default.existsSync(staticPath)) {
    logger.log('=> Loading static files from: ' + staticPath + ' .');
    app.use(_express2.default.static(staticPath, { index: false }));
  } else {
    logger.error('Error: no such directory to load static files: ' + staticPath);
    process.exit(-1);
  }
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
var configDir = _commander2.default.configDir || './.storybook';
var config = (0, _config2.default)('DEVELOPMENT', _webpack4.default, configDir);

var compiler = (0, _webpack2.default)(config);
var devMiddlewareOptions = {
  noInfo: true,
  publicPath: config.output.publicPath
};
app.use((0, _webpackDevMiddleware2.default)(compiler, devMiddlewareOptions));
app.use((0, _webpackHotMiddleware2.default)(compiler));

app.get('/', function (req, res) {
  res.send((0, _index2.default)());
});

var headHtml = (0, _utils.getHeadHtml)(configDir);
app.get('/iframe.html', function (req, res) {
  res.send((0, _iframe2.default)(headHtml));
});

app.listen.apply(app, listenAddr.concat([function (error) {
  if (error) {
    throw error;
  } else {
    var address = 'http://' + (_commander2.default.host || 'localhost') + ':' + _commander2.default.port + '/';
    logger.info('\nReact Storybook started on => ' + address + '\n');
  }
}]));