'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iframeStyle = {
  width: '100%',
  height: '100%',
  border: 0,
  margin: 0,
  padding: 0
};

var Preview = function Preview(_ref) {
  var url = _ref.url;
  return _react2.default.createElement('iframe', {
    id: 'storybook-preview-iframe',
    style: iframeStyle,
    src: url
  });
};

Preview.propTypes = {
  url: _react2.default.PropTypes.string
};

exports.default = Preview;