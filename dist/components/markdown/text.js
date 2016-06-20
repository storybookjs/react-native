'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.A = exports.Small = exports.P = undefined;

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

var P = exports.P = function (_React$Component) {
  (0, _inherits3.default)(P, _React$Component);

  function P() {
    (0, _classCallCheck3.default)(this, P);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(P).apply(this, arguments));
  }

  (0, _createClass3.default)(P, [{
    key: 'render',
    value: function render() {
      var style = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        fontSize: '1rem',
        marginBottom: '1.3rem',
        color: '#444'
      };
      return _react2.default.createElement(
        'p',
        { style: style },
        this.props.children
      );
    }
  }]);
  return P;
}(_react2.default.Component);

var Small = exports.Small = function (_React$Component2) {
  (0, _inherits3.default)(Small, _React$Component2);

  function Small() {
    (0, _classCallCheck3.default)(this, Small);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Small).apply(this, arguments));
  }

  (0, _createClass3.default)(Small, [{
    key: 'render',
    value: function render() {
      var style = {};

      return _react2.default.createElement(
        'ul',
        { style: style },
        this.props.children
      );
    }
  }]);
  return Small;
}(_react2.default.Component);

var A = exports.A = function (_React$Component3) {
  (0, _inherits3.default)(A, _React$Component3);

  function A() {
    (0, _classCallCheck3.default)(this, A);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(A).apply(this, arguments));
  }

  (0, _createClass3.default)(A, [{
    key: 'render',
    value: function render() {
      var style = {
        color: '#3498db'
      };

      return _react2.default.createElement(
        'a',
        { href: this.props.href, style: style },
        this.props.children
      );
    }
  }]);
  return A;
}(_react2.default.Component);