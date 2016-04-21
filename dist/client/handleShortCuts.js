'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleShortCuts;

var _admin = require('./ui/admin');

var _admin2 = _interopRequireDefault(_admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleShortCuts(e, data) {
  if (e.keyCode === 80 && (e.metaKey || e.ctrlKey || e.keyCode === 19)) {
    // e.preventDefault();
    console.log(e);
    (0, _admin2.default)(data);
  }
}