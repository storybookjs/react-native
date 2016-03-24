'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionLogger = function (_React$Component) {
  (0, _inherits3.default)(ActionLogger, _React$Component);

  function ActionLogger() {
    (0, _classCallCheck3.default)(this, ActionLogger);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ActionLogger).apply(this, arguments));
  }

  (0, _createClass3.default)(ActionLogger, [{
    key: 'render',
    value: function render() {
      var h3Style = {
        fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
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

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          { style: h3Style },
          'ACTION LOGGER'
        ),
        _react2.default.createElement(
          'pre',
          { style: preStyle },
          this.props.actionLog
        )
      );
    }
  }]);
  return ActionLogger;
}(_react2.default.Component);

exports.default = ActionLogger;