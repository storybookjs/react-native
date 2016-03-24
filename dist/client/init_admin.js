'use strict';

var _admin = require('./ui/admin');

var _admin2 = _interopRequireDefault(_admin);

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _data.watchData)(function (data) {
  (0, _admin2.default)(data);
});
(0, _admin2.default)((0, _data.getData)());