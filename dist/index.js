'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.knob = knob;
exports.text = text;
exports.boolean = boolean;
exports.number = number;
exports.object = object;
exports.select = select;
exports.withKnobs = withKnobs;

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _KnobManager = require('./KnobManager');

var _KnobManager2 = _interopRequireDefault(_KnobManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager = new _KnobManager2.default();

function knob(name, options) {
  return manager.knob(name, options);
}

function text(name, value) {
  return manager.knob(name, { type: 'text', value: value });
}

function boolean(name, value) {
  return manager.knob(name, { type: 'boolean', value: value });
}

function number(name, value) {
  return manager.knob(name, { type: 'number', value: value });
}

function object(name, value) {
  return manager.knob(name, { type: 'object', value: value });
}

function select(name, options, value) {
  return manager.knob(name, { type: 'select', options: options, value: value });
}

function withKnobs(storyFn, context) {
  var channel = _storybookAddons2.default.getChannel();
  return manager.wrapStory(channel, storyFn, context);
}