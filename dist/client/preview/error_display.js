'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainStyle = {
  position: 'fixed',
  top: 0, bottom: 0, left: 0, right: 0,
  padding: 20,
  backgroundColor: 'rgb(187, 49, 49)',
  color: '#FFF',
  WebkitFontSmoothing: 'antialiased'
};

var headingStyle = (0, _defineProperty3.default)({
  fontFamily: 'inherit',
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 0.2,
  margin: '10px 0'
}, 'fontFamily', '\n    -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI",\n    "Helvetica Neue", "Lucida Grande", sans-serif\n    ');

var codeStyle = {
  fontSize: 14,
  width: '100vw',
  overflow: 'auto'
};

var ErrorDisplay = function ErrorDisplay(_ref) {
  var error = _ref.error;
  return _react2.default.createElement(
    'div',
    { style: mainStyle, __self: undefined
    },
    _react2.default.createElement(
      'div',
      { style: headingStyle, __self: undefined
      },
      error.message
    ),
    _react2.default.createElement(
      'pre',
      { style: codeStyle, __self: undefined
      },
      _react2.default.createElement(
        'code',
        {
          __self: undefined
        },
        error.stack
      )
    )
  );
};

ErrorDisplay.propTypes = {
  error: _react2.default.PropTypes.object.isRequired
};

exports.default = ErrorDisplay;