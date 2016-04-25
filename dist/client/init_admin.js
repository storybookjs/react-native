'use strict';

var _admin = require('./ui/admin');

var _admin2 = _interopRequireDefault(_admin);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var syncedStore = (0, _.getSyncedStore)();

syncedStore.watchData(function (data) {
  (0, _admin2.default)(data);
});

(0, _admin2.default)(syncedStore.getData());