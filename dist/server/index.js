#!/usr/bin/env node
'use strict';

var _middleware = require('@kadira/storybook-database-local/dist/server/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _middleware3 = require('./middleware');

var _middleware4 = _interopRequireDefault(_middleware3);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _utils = require('./utils');

var _track_usage = require('./track_usage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = console;

_commander2.default.version(_package2.default.version).option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt).option('-h, --host [string]', 'Host to run Storybook').option('-s, --static-dir <dir-names>', 'Directory where to load static files from').option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').option('-d, --db-path [db-file]', 'File where to store addon database JSON file').option('--enable-db', 'Enable the (experimental) addon database service on dev-server').option('--dont-track', 'Do not send anonymous usage stats.').parse(process.argv);

// The key is the field created in `program` variable for
// each command line argument. Value is the env variable.
(0, _utils.getEnvConfig)(_commander2.default, {
  port: 'SBCONFIG_PORT',
  host: 'SBCONFIG_HOSTNAME',
  staticDir: 'SBCONFIG_STATIC_DIR',
  configDir: 'SBCONFIG_CONFIG_DIR',
  dontTrack: 'SBCONFIG_DO_NOT_TRACK'
});

if (_commander2.default.dontTrack) {
  (0, _track_usage.dontTrack)();
}

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
app.use((0, _serveFavicon2.default)(_path2.default.resolve(__dirname, 'public/favicon.ico')));

if (_commander2.default.staticDir) {
  _commander2.default.staticDir = (0, _utils.parseList)(_commander2.default.staticDir);
  _commander2.default.staticDir.forEach(function (dir) {
    var staticPath = _path2.default.resolve(dir);
    if (!_fs2.default.existsSync(staticPath)) {
      logger.error('Error: no such directory to load static files: ' + staticPath);
      process.exit(-1);
    }
    logger.log('=> Loading static files from: ' + staticPath + ' .');
    app.use(_express2.default.static(staticPath, { index: false }));
  });
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
var configDir = _commander2.default.configDir || './.storybook';

// The addon database service is disabled by default for now
// It should be enabled with the --enable-db for dev server
if (_commander2.default.enableDb) {
  // NOTE enables database on client
  process.env.STORYBOOK_ENABLE_DB = 1;
  var dbPath = _commander2.default.dbPath || _path2.default.resolve(configDir, 'addon-db.json');
  app.use('/db', (0, _middleware2.default)(dbPath));
}

// NOTE changes to env should be done before calling `getBaseConfig`
// `getBaseConfig` function which is called inside the middleware
app.use((0, _middleware4.default)(configDir));

app.listen.apply(app, listenAddr.concat([function (error) {
  if (error) {
    throw error;
  } else {
    var address = 'http://' + (_commander2.default.host || 'localhost') + ':' + _commander2.default.port + '/';
    logger.info('\nReact Storybook started on => ' + _chalk2.default.cyan(address) + '\n');
    (0, _track_usage.track)();
  }
}]));