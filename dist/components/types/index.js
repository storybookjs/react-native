'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

var _Boolean = require('./Boolean');

var _Boolean2 = _interopRequireDefault(_Boolean);

var _Object = require('./Object');

var _Object2 = _interopRequireDefault(_Object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  text: _Text2.default,
  number: _Number2.default,
  boolean: _Boolean2.default,
  object: _Object2.default
};