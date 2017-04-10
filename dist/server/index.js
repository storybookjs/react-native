#!/usr/bin/env node
'use strict';

var _server;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

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

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _utils = require('./utils');

var _track_usage = require('./track_usage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = console;
_commander2.default.version(_package2.default.version).option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt).option('-h, --host [string]', 'Host to run Storybook').option('-s, --static-dir <dir-names>', 'Directory where to load static files from').option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').option('--dont-track', 'Do not send anonymous usage stats.').option('--https', 'Serve Storybook over HTTPS. Note: You must provide your own certificate information.').option('--ssl-ca <ca>', 'Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)', _utils.parseList).option('--ssl-cert <cert>', 'Provide an SSL certificate. (Required with --https)').option('--ssl-key <key>', 'Provide an SSL key. (Required with --https)').option('-d, --db-path [db-file]', 'DEPRECATED!').option('--enable-db', 'DEPRECATED!').parse(process.argv);

logger.info(_chalk2.default.bold(_package2.default.name + ' v' + _package2.default.version + '\n'));

if (_commander2.default.enableDb || _commander2.default.dbPath) {
  logger.error(['Error: the experimental local database addon is no longer bundled with', 'react-storybook. Please remove these flags (-d,--db-path,--enable-db)', 'from the command or npm script and try again.'].join(' '));
  process.exit(1);
}

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
var server = app;

if (_commander2.default.https) {
  if (!_commander2.default.sslCert) {
    logger.error('Error: --ssl-cert is required with --https');
    process.exit(-1);
  }
  if (!_commander2.default.sslKey) {
    logger.error('Error: --ssl-key is required with --https');
    process.exit(-1);
  }

  var sslOptions = {
    ca: (_commander2.default.sslCa || []).map(function (ca) {
      return _fs2.default.readFileSync(ca, 'utf-8');
    }),
    cert: _fs2.default.readFileSync(_commander2.default.sslCert, 'utf-8'),
    key: _fs2.default.readFileSync(_commander2.default.sslKey, 'utf-8')
  };

  server = _https2.default.createServer(sslOptions, app);
}

var hasCustomFavicon = false;

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

    var faviconPath = _path2.default.resolve(staticPath, 'favicon.ico');
    if (_fs2.default.existsSync(faviconPath)) {
      hasCustomFavicon = true;
      app.use((0, _serveFavicon2.default)(faviconPath));
    }
  });
}

if (!hasCustomFavicon) {
  app.use((0, _serveFavicon2.default)(_path2.default.resolve(__dirname, 'public/favicon.ico')));
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
var configDir = _commander2.default.configDir || './.storybook';

// The repository info is sent to the storybook while running on
// development mode so it'll be easier for tools to integrate.
var exec = function exec(cmd) {
  return _shelljs2.default.exec(cmd, { silent: true }).stdout.trim();
};
process.env.STORYBOOK_GIT_ORIGIN = process.env.STORYBOOK_GIT_ORIGIN || exec('git remote get-url origin');
process.env.STORYBOOK_GIT_BRANCH = process.env.STORYBOOK_GIT_BRANCH || exec('git symbolic-ref HEAD --short');

// NOTE changes to env should be done before calling `getBaseConfig`
// `getBaseConfig` function which is called inside the middleware
app.use((0, _middleware2.default)(configDir));

(_server = server).listen.apply(_server, listenAddr.concat([function (error) {
  if (error) {
    throw error;
  } else {
    var address = 'http' + (_commander2.default.https ? 's' : '') + '://' + (_commander2.default.host || 'localhost') + ':' + _commander2.default.port + '/';
    logger.info('\nReact Storybook started on => ' + _chalk2.default.cyan(address) + '\n');
    (0, _track_usage.track)();
  }
}]));