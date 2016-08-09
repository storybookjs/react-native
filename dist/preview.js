'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = action;

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _ = require('./');

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
    var randomId = Math.random().toString(16).slice(2);
    channel.emit(_.EVENT_ID, {
      id: randomId,
      data: { name: name, args: args }
    });
  };
}