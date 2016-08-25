'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkTo = exports.action = exports.getStorybookUI = exports.getStorybook = exports.configure = exports.addDecorator = exports.setAddon = exports.storiesOf = undefined;

var _storybookAddonActions = require('@kadira/storybook-addon-actions');

Object.defineProperty(exports, 'action', {
  enumerable: true,
  get: function get() {
    return _storybookAddonActions.action;
  }
});

var _storybookAddonLinks = require('@kadira/storybook-addon-links');

Object.defineProperty(exports, 'linkTo', {
  enumerable: true,
  get: function get() {
    return _storybookAddonLinks.linkTo;
  }
});

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preview = new _preview2.default();

var storiesOf = exports.storiesOf = preview.storiesOf.bind(preview);
var setAddon = exports.setAddon = preview.setAddon.bind(preview);
var addDecorator = exports.addDecorator = preview.addDecorator.bind(preview);
var configure = exports.configure = preview.configure.bind(preview);
var getStorybook = exports.getStorybook = preview.getStorybook.bind(preview);
var getStorybookUI = exports.getStorybookUI = preview.getStorybookUI.bind(preview);

// NOTE export these to keep backwards compatibility