'use strict';

var _preview = require('./ui/preview');

var _preview2 = _interopRequireDefault(_preview);

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _data.watchData)(_preview2.default);