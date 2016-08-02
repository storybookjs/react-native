'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkTo = linkTo;
exports.register = register;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkTo(kind, story) {
  return function () {
    var channel = _storybookAddons2.default.getChannel();
    channel.emit('addon:links', { kind: kind, story: story });
  };
}

function register() {
  _storybookAddons2.default.register('kadirahq/storybook-addon-links', function (api) {
    var channel = _storybookAddons2.default.getChannel();
    channel.on('addon:links', function (selection) {
      api.selectStory(selection.kind, selection.story);
    });
  });
}