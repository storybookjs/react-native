'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.A = exports.UL = exports.LI = exports.P = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _theme = require('../theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var P = exports.P = function (_React$Component) {
  (0, _inherits3.default)(P, _React$Component);

  function P() {
    (0, _classCallCheck3.default)(this, P);
    return (0, _possibleConstructorReturn3.default)(this, (P.__proto__ || (0, _getPrototypeOf2.default)(P)).apply(this, arguments));
  }

  (0, _createClass3.default)(P, [{
    key: 'render',
    value: function render() {
      var style = (0, _extends3.default)({}, _theme.baseFonts, {
        fontSize: '15px'
      });
      return _react2.default.createElement(
        'p',
        { style: style },
        this.props.children
      );
    }
  }]);
  return P;
}(_react2.default.Component);

var LI = exports.LI = function (_React$Component2) {
  (0, _inherits3.default)(LI, _React$Component2);

  function LI() {
    (0, _classCallCheck3.default)(this, LI);
    return (0, _possibleConstructorReturn3.default)(this, (LI.__proto__ || (0, _getPrototypeOf2.default)(LI)).apply(this, arguments));
  }

  (0, _createClass3.default)(LI, [{
    key: 'render',
    value: function render() {
      var style = (0, _extends3.default)({}, _theme.baseFonts, {
        fontSize: '15px'
      });
      return _react2.default.createElement(
        'li',
        { style: style },
        this.props.children
      );
    }
  }]);
  return LI;
}(_react2.default.Component);

var UL = exports.UL = function (_React$Component3) {
  (0, _inherits3.default)(UL, _React$Component3);

  function UL() {
    (0, _classCallCheck3.default)(this, UL);
    return (0, _possibleConstructorReturn3.default)(this, (UL.__proto__ || (0, _getPrototypeOf2.default)(UL)).apply(this, arguments));
  }

  (0, _createClass3.default)(UL, [{
    key: 'render',
    value: function render() {
      var style = (0, _extends3.default)({}, _theme.baseFonts, {
        fontSize: '15px'
      });

      return _react2.default.createElement(
        'ul',
        { style: style },
        this.props.children
      );
    }
  }]);
  return UL;
}(_react2.default.Component);

var A = exports.A = function (_React$Component4) {
  (0, _inherits3.default)(A, _React$Component4);

  function A() {
    (0, _classCallCheck3.default)(this, A);
    return (0, _possibleConstructorReturn3.default)(this, (A.__proto__ || (0, _getPrototypeOf2.default)(A)).apply(this, arguments));
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