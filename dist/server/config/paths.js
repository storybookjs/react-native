'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excludePaths = exports.includePaths = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var includePaths = exports.includePaths = [_path2.default.resolve('./')];

var excludePaths = exports.excludePaths = [_path2.default.resolve('./node_modules')];