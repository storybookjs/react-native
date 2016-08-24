#!/usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-h, --host <host>', 'host to listen on').option('-p, --port <port>', 'port to listen on').parse(process.argv);

// RN packager
_shelljs2.default.exec(['node node_modules/react-native/local-cli/cli.js start', '--projectRoots ' + _path2.default.resolve('storybook'), '--root ' + _path2.default.resolve()].join(' '), { async: true, silent: false });