'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = undefined;

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

var H1 = exports.H1 = function (_React$Component) {
  (0, _inherits3.default)(H1, _React$Component);

  function H1() {
    (0, _classCallCheck3.default)(this, H1);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H1).apply(this, arguments));
  }

  (0, _createClass3.default)(H1, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        color: '#777',
        borderBottom: '2px solid #fafafa',
        marginBottom: '1.15rem',
        paddingBottom: '.5rem',
        margin: '1.414rem 0 .5rem',
        fontWeight: 'inherit',
        lineHeight: 1.42,
        textAlign: 'center',
        marginTop: 0,
        fontSize: '3.998rem'
      };

      return _react2.default.createElement(
        'h1',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H1;
}(_react2.default.Component);

var H2 = exports.H2 = function (_React$Component2) {
  (0, _inherits3.default)(H2, _React$Component2);

  function H2() {
    (0, _classCallCheck3.default)(this, H2);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H2).apply(this, arguments));
  }

  (0, _createClass3.default)(H2, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        borderBottom: '2px solid #fafafa',
        marginBottom: '1.15rem',
        paddingBottom: '.5rem',
        margin: '1.414rem 0 .5rem',
        fontWeight: 'inherit',
        lineHeight: 1.42,
        fontSize: '2.827rem'
      };

      return _react2.default.createElement(
        'h2',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H2;
}(_react2.default.Component);

var H3 = exports.H3 = function (_React$Component3) {
  (0, _inherits3.default)(H3, _React$Component3);

  function H3() {
    (0, _classCallCheck3.default)(this, H3);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H3).apply(this, arguments));
  }

  (0, _createClass3.default)(H3, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        borderBottom: '2px solid #fafafa',
        marginBottom: '1.15rem',
        paddingBottom: '.5rem',
        margin: '1.414rem 0 .5rem',
        fontWeight: 'inherit',
        lineHeight: 1.42,
        fontSize: '1.999rem'
      };

      return _react2.default.createElement(
        'h3',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H3;
}(_react2.default.Component);

var H4 = exports.H4 = function (_React$Component4) {
  (0, _inherits3.default)(H4, _React$Component4);

  function H4() {
    (0, _classCallCheck3.default)(this, H4);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H4).apply(this, arguments));
  }

  (0, _createClass3.default)(H4, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        color: '#444',
        margin: '1.414rem 0 .5rem',
        fontWeight: 'inherit',
        lineHeight: 1.42,
        fontSize: '1.414rem'
      };

      return _react2.default.createElement(
        'h4',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H4;
}(_react2.default.Component);

var H5 = exports.H5 = function (_React$Component5) {
  (0, _inherits3.default)(H5, _React$Component5);

  function H5() {
    (0, _classCallCheck3.default)(this, H5);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H5).apply(this, arguments));
  }

  (0, _createClass3.default)(H5, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        fontSize: '1.121rem'
      };

      return _react2.default.createElement(
        'h5',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H5;
}(_react2.default.Component);

var H6 = exports.H6 = function (_React$Component6) {
  (0, _inherits3.default)(H6, _React$Component6);

  function H6() {
    (0, _classCallCheck3.default)(this, H6);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(H6).apply(this, arguments));
  }

  (0, _createClass3.default)(H6, [{
    key: 'render',
    value: function render() {
      var styles = {
        fontFamily: 'Arimo, Helvetica, sans-serif',
        fontSize: '.88rem'
      };

      return _react2.default.createElement(
        'h6',
        { id: this.props.id, style: styles },
        this.props.children
      );
    }
  }]);
  return H6;
}(_react2.default.Component);