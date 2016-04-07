'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: '0',
  position: 'absolute',
  top: '30px',
  right: 0,
  bottom: 0,
  left: 0
};

var wrapStyle = {
  position: 'relative',
  height: '100%'
};

var headStyle = {
  fontFamily: '\n    -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n    "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n  ',
  color: '#444',
  letterSpacing: '2px',
  fontSize: 12,
  margin: '0 0 0 5px'
};

var btnStyle = {
  marginLeft: 5
};

var ActionLogger = function ActionLogger(_ref) {
  var actionLog = _ref.actionLog;
  var onClear = _ref.onClear;
  return _react2.default.createElement(
    'div',
    { style: wrapStyle },
    _react2.default.createElement(
      'h3',
      { style: headStyle },
      'ACTION LOGGER',
      _react2.default.createElement(
        'button',
        { style: btnStyle, onClick: onClear },
        'CLEAR'
      )
    ),
    _react2.default.createElement(
      'pre',
      { style: preStyle },
      actionLog
    )
  );
};

ActionLogger.propTypes = {
  actionLog: _react2.default.PropTypes.string.isRequired,
  onClear: _react2.default.PropTypes.func
};

exports.default = ActionLogger;