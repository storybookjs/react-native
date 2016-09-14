'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeModulesPaths = exports.excludePaths = exports.includePaths = exports.OccurenceOrderPlugin = undefined;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OccurenceOrderPlugin =
// for webpack 2
exports.OccurenceOrderPlugin = _webpack2.default.optimize.OccurrenceOrderPlugin ||
// for webpack 1
_webpack2.default.optimize.OccurenceOrderPlugin;

var includePaths = exports.includePaths = [_path2.default.resolve('./')];

var excludePaths = exports.excludePaths = [_path2.default.resolve('./node_modules')];

var nodeModulesPaths = exports.nodeModulesPaths = _path2.default.resolve('./node_modules');