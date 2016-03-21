'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = function Layout(_ref) {
  var controls = _ref.controls;
  var content = _ref.content;
  return _react2.default.createElement(
    'div',
    { style: {} },
    _react2.default.createElement(
      'div',
      { style: { width: '250px', float: 'left' } },
      controls
    ),
    _react2.default.createElement(
      'div',
      { style: { float: 'left' } },
      content
    )
  );
};

exports.default = Layout;