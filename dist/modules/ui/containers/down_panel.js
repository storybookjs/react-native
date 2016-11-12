'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapper = mapper;

var _down_panel = require('../components/down_panel');

var _down_panel2 = _interopRequireDefault(_down_panel);

var _gen_redux_loader = require('../libs/gen_redux_loader');

var _gen_redux_loader2 = _interopRequireDefault(_gen_redux_loader);

var _compose = require('../../../compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapper(_ref, props, _ref2) {
  var ui = _ref.ui;
  var context = _ref2.context,
      actions = _ref2.actions;

  var panels = context().provider.getPanels();
  var actionMap = actions();
  var selectedPanel = ui.selectedDownPanel;

  return {
    panels: panels,
    selectedPanel: selectedPanel,
    onPanelSelect: actionMap.ui.selectDownPanel
  };
}

exports.default = (0, _compose2.default)((0, _gen_redux_loader2.default)(mapper))(_down_panel2.default);