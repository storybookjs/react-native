'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init_api = require('./configs/init_api');

var _init_api2 = _interopRequireDefault(_init_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  load: function load(_ref, actions) {
    var reduxStore = _ref.reduxStore;
    var provider = _ref.provider;

    (0, _init_api2.default)(provider, reduxStore, actions);
  }
};