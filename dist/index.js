'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.knob = knob;
exports.text = text;
exports.boolean = boolean;
exports.number = number;
exports.color = color;
exports.object = object;
exports.select = select;
exports.array = array;
exports.date = date;
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
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var defaults = {
    range: false,
    min: 0,
    max: 10,
    step: 1
  };

  var mergedOptions = (0, _extends3.default)({}, defaults, options);

  var finalOptions = (0, _extends3.default)({}, mergedOptions, {
    type: 'number',
    value: value
  });

  return manager.knob(name, finalOptions);
}

function color(name, value) {
  return manager.knob(name, { type: 'color', value: value });
}

function object(name, value) {
  return manager.knob(name, { type: 'object', value: value });
}

function select(name, options, value) {
  return manager.knob(name, { type: 'select', options: options, value: value });
}

function array(name, value) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';

  return manager.knob(name, { type: 'array', value: value, separator: separator });
}

function date(name) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

  var proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue });
}

function withKnobs(storyFn, context) {
  var channel = _storybookAddons2.default.getChannel();
  return manager.wrapStory(channel, storyFn, context);
}