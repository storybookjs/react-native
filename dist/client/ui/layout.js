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

var Layout = function (_React$Component) {
  (0, _inherits3.default)(Layout, _React$Component);

  function Layout() {
    (0, _classCallCheck3.default)(this, Layout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Layout).apply(this, arguments));
  }

  (0, _createClass3.default)(Layout, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var controls = _props.controls;
      var content = _props.content;
      var height = this.state.height;


      var rootStyles = {
        height: height
      };
      var controlsStyle = {
        width: '240px',
        float: 'left',
        height: '100%',
        overflowY: 'auto'
      };
      // borderRight: '3px solid #DDD',
      var contentStyle = {
        height: height,
        marginLeft: '250px',
        border: '1px solid #DDD',
        borderRadius: '4px',
        boxShadow: '0px 2px 6px -1px #b8b8b8'
      };

      return _react2.default.createElement(
        'div',
        { style: rootStyles },
        _react2.default.createElement(
          'div',
          { style: controlsStyle },
          controls
        ),
        _react2.default.createElement(
          'div',
          { style: contentStyle },
          content
        )
      );
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateHeight();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener("resize", this.updateHeight.bind(this));
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var _document = document;
      var documentElement = _document.documentElement;
      var body = _document.body;

      var height = documentElement.clientHeight || body.clientHeight;
      height -= 20;
      this.setState({ height: height });
    }
  }]);
  return Layout;
}(_react2.default.Component);

exports.default = Layout;