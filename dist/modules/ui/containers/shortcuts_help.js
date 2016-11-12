'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapper = undefined;

var _shortcuts_help = require('../components/shortcuts_help');

var _shortcuts_help2 = _interopRequireDefault(_shortcuts_help);

var _gen_redux_loader = require('../libs/gen_redux_loader');

var _gen_redux_loader2 = _interopRequireDefault(_gen_redux_loader);

var _compose = require('../../../compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapper = exports.mapper = function mapper(_ref, props, _ref2) {
  var ui = _ref.ui;
  var actions = _ref2.actions;

  var actionMap = actions();
  var data = {
    isOpen: ui.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp,
    platform: window.navigator.platform.toLowerCase()
  };

  return data;
};

exports.default = (0, _compose2.default)((0, _gen_redux_loader2.default)(mapper))(_shortcuts_help2.default);