'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

var _Color = require('./Color');

var _Color2 = _interopRequireDefault(_Color);

var _Boolean = require('./Boolean');

var _Boolean2 = _interopRequireDefault(_Boolean);

var _Object = require('./Object');

var _Object2 = _interopRequireDefault(_Object);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _Array = require('./Array');

var _Array2 = _interopRequireDefault(_Array);

var _Date = require('./Date');

var _Date2 = _interopRequireDefault(_Date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  text: _Text2.default,
  number: _Number2.default,
  color: _Color2.default,
  boolean: _Boolean2.default,
  object: _Object2.default,
  select: _Select2.default,
  array: _Array2.default,
  date: _Date2.default
};