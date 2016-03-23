'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = renderPreview;
exports.renderError = renderError;
exports.renderMain = renderMain;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

var _storybook = require('../storybook');

var _storybook2 = _interopRequireDefault(_storybook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');

function renderPreview(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  return renderMain(data);
}

function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var redBox = _react2.default.createElement(_redboxReact2.default, { error: error });
  _reactDom2.default.render(redBox, rootEl);
}

function renderMain(data) {
  var firstKey = (0, _keys2.default)(_storybook2.default)[0];
  var firstStory = (0, _keys2.default)(_storybook2.default[firstKey])[0];

  var main = _storybook2.default[firstKey][firstStory];
  _reactDom2.default.render(main(), rootEl);
}