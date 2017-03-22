'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (storyFn) {
  return _react2.default.createElement(
    'div',
    { style: style },
    storyFn()
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};