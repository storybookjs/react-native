#!/usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-h, --host <host>', 'host to listen on').option('-p, --port <port>', 'port to listen on').option('-c, --config-dir [dir-name]', 'storybook config directory').parse(process.argv);

var projectDir = _path2.default.resolve();
var configDir = _path2.default.resolve(_commander2.default.configDir || './storybook');
var listenAddr = [_commander2.default.port];
if (_commander2.default.host) {
  listenAddr.push(_commander2.default.host);
}

var server = new _server2.default({ configDir: configDir });
server.listen.apply(server, listenAddr.concat([function (err) {
  if (err) {
    throw err;
  }
  var address = 'http://' + (_commander2.default.host || 'localhost') + ':' + _commander2.default.port + '/';
  console.info('\nReact Native Storybook started on => ' + address + '\n');
}]));

// RN packager
_shelljs2.default.exec(['node node_modules/react-native/local-cli/cli.js start', '--projectRoots ' + configDir, '--root ' + projectDir].join(' '), { async: true });