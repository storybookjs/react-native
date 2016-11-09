'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapper = undefined;

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _layout = require('../components/layout');

var _layout2 = _interopRequireDefault(_layout);

var _gen_redux_loader = require('../libs/gen_redux_loader');

var _gen_redux_loader2 = _interopRequireDefault(_gen_redux_loader);

var _compose = require('../../../compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapper = exports.mapper = function mapper(_ref) {
  var shortcuts = _ref.shortcuts;

  return (0, _lodash2.default)(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen', 'downPanelInRight');
};

exports.default = (0, _compose2.default)((0, _gen_redux_loader2.default)(mapper))(_layout2.default);