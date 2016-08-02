'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = action;
exports.register = register;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _ActionLogger = require('./containers/ActionLogger');

var _ActionLogger2 = _interopRequireDefault(_ActionLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _format(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return '[SyntheticEvent]';
  }
  return arg;
}

function action(name) {
  return function () {
    for (var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    var args = Array.from(_args).map(_format);
    var channel = _storybookAddons2.default.getChannel();
    channel.emit('addon:actions', {
      id: Math.random().toString(16).slice(2),
      data: { name: name, args: args }
    });
  };
}

function register() {
  _storybookAddons2.default.register('kadirahq/storybook-addon-actions', function (api) {
    var channel = _storybookAddons2.default.getChannel();
    _storybookAddons2.default.addPanel('kadirahq/storybook-addon-actions', {
      title: 'Action Logger',
      render: function render() {
        return _react2.default.createElement(_ActionLogger2.default, { channel: channel });
      }
    });
  });
}