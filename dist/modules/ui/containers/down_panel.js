'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

exports.composer = composer;

var _down_panel = require('../components/down_panel');

var _down_panel2 = _interopRequireDefault(_down_panel);

var _mantraCore = require('mantra-core');

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composer(_ref, _ref2) {
  var context = _ref2.context;
  (0, _objectDestructuringEmpty3.default)(_ref);

  return {
    addons: context().provider.getAddons()
  };
}

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_down_panel2.default);