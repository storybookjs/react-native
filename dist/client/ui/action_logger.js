'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var h3Style = {
  fontFamily: '\n    -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n    "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n  ',
  color: '#444',
  letterSpacing: '2px',
  fontSize: 12,
  margin: '12px 0 5px 0'
};

var preStyle = {
  height: 105,
  overflowY: 'auto',
  backgroundColor: '#FFF',
  borderRadius: 3,
  padding: 8,
  color: '#666',
  border: '1px solid #EAEAEA'
};

var clearButtonStyle = {
  marginLeft: 5
};

var ActionLogger = function ActionLogger(_ref) {
  var actionLog = _ref.actionLog;
  var onClear = _ref.onClear;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h3',
      { style: h3Style },
      'ACTION LOGGER',
      _react2.default.createElement(
        'button',
        { style: clearButtonStyle, onClick: onClear },
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