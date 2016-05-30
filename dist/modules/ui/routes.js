'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (injectDeps, _ref) {
  var Preview = _ref.Preview;

  var InjectedLayout = injectDeps(_layout2.default);
  var InjectedShortcutsHelp = injectDeps(_shortcuts_help2.default);
  var rootEl = document.getElementById('root');

  var root = _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(InjectedLayout, {
      leftPanel: function leftPanel() {
        return _react2.default.createElement(_left_panel2.default, null);
      },
      preview: function preview() {
        return _react2.default.createElement(Preview, null);
      },
      downPanel: function downPanel() {
        return _react2.default.createElement(_action_logger2.default, null);
      }
    }),
    _react2.default.createElement(InjectedShortcutsHelp, null)
  );
  _reactDom2.default.render(root, rootEl);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _layout = require('./containers/layout');

var _layout2 = _interopRequireDefault(_layout);

var _left_panel = require('./containers/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

var _action_logger = require('./containers/action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _shortcuts_help = require('./containers/shortcuts_help');

var _shortcuts_help2 = _interopRequireDefault(_shortcuts_help);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }