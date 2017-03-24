'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockquote = exports.Pre = exports.Code = undefined;

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

var Code = exports.Code = function (_React$Component) {
  (0, _inherits3.default)(Code, _React$Component);

  function Code() {
    (0, _classCallCheck3.default)(this, Code);
    return (0, _possibleConstructorReturn3.default)(this, (Code.__proto__ || (0, _getPrototypeOf2.default)(Code)).apply(this, arguments));
  }

  (0, _createClass3.default)(Code, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.highlight();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.highlight();
    }
  }, {
    key: 'highlight',
    value: function highlight() {
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var codeStyle = {
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        backgroundColor: '#fafafa'
      };

      var preStyle = {
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        backgroundColor: '#fafafa',
        padding: '.5rem',
        lineHeight: 1.5,
        overflowX: 'scroll'
      };

      var className = this.props.language ? 'language-' + this.props.language : '';

      return _react2.default.createElement(
        'pre',
        { style: preStyle, className: className },
        _react2.default.createElement(
          'code',
          { style: codeStyle, className: className },
          this.props.code
        )
      );
    }
  }]);
  return Code;
}(_react2.default.Component);

var Pre = exports.Pre = function (_React$Component2) {
  (0, _inherits3.default)(Pre, _React$Component2);

  function Pre() {
    (0, _classCallCheck3.default)(this, Pre);
    return (0, _possibleConstructorReturn3.default)(this, (Pre.__proto__ || (0, _getPrototypeOf2.default)(Pre)).apply(this, arguments));
  }

  (0, _createClass3.default)(Pre, [{
    key: 'render',
    value: function render() {
      var style = {
        fontSize: '.88em',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        backgroundColor: '#fafafa',
        padding: '.5rem',
        lineHeight: 1.5,
        overflowX: 'scroll'
      };

      return _react2.default.createElement(
        'pre',
        { style: style },
        this.props.children
      );
    }
  }]);
  return Pre;
}(_react2.default.Component);

var Blockquote = exports.Blockquote = function (_React$Component3) {
  (0, _inherits3.default)(Blockquote, _React$Component3);

  function Blockquote() {
    (0, _classCallCheck3.default)(this, Blockquote);
    return (0, _possibleConstructorReturn3.default)(this, (Blockquote.__proto__ || (0, _getPrototypeOf2.default)(Blockquote)).apply(this, arguments));
  }

  (0, _createClass3.default)(Blockquote, [{
    key: 'render',
    value: function render() {
      var style = {
        fontSize: '1.88em',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        borderLeft: '8px solid #fafafa',
        padding: '1rem'
      };

      return _react2.default.createElement(
        'blockquote',
        { style: style },
        this.props.children
      );
    }
  }]);
  return Blockquote;
}(_react2.default.Component);