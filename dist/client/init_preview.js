'use strict';

var _preview = require('./ui/preview');

var _preview2 = _interopRequireDefault(_preview);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _.getSyncedStore)().watchData(_preview2.default);