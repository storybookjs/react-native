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

function _format(message) {
  if (typeof message.preventDefault !== 'undefined') {
    return '[SyntheticEvent]';
  }
  return message;
}

function action(name) {
  return function (_message) {
    var message = _format(_message);
    var channel = _storybookAddons2.default.getChannel();
    channel.emit('addon:actions', {
      id: Math.random().toString(16).slice(2),
      data: { name: name, message: message }
    });
  };
}

function register() {
  _storybookAddons2.default.register('kadirahq/storybook-addon-actions', function (api) {
    _storybookAddons2.default.addPanel('kadirahq/storybook-addon-actions', {
      title: 'Action Logger',
      render: function render() {
        var channel = _storybookAddons2.default.getChannel();
        return _react2.default.createElement(_ActionLogger2.default, { channel: channel });
      }
    });
  });
}