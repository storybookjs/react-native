'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkTo = linkTo;

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkTo(kind, story) {
  return function () {
    var resolvedKind = typeof kind === 'function' ? kind.apply(undefined, arguments) : kind;
    var resolvedStory = typeof story === 'function' ? story.apply(undefined, arguments) : story;

    var channel = _storybookAddons2.default.getChannel();
    console.log(resolvedKind);
    channel.emit(_.EVENT_ID, { kind: resolvedKind, story: resolvedStory });
  };
}