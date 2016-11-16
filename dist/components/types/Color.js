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

var styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  color: '#444',
  backgroundColor: 'white'
};

var ColorType = function (_React$Component) {
  (0, _inherits3.default)(ColorType, _React$Component);

  function ColorType() {
    (0, _classCallCheck3.default)(this, ColorType);
    return (0, _possibleConstructorReturn3.default)(this, (ColorType.__proto__ || (0, _getPrototypeOf2.default)(ColorType)).apply(this, arguments));
  }

  (0, _createClass3.default)(ColorType, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;


      return _react2.default.createElement('input', {
        id: knob.name,
        style: styles,
        value: knob.value,
        type: 'color',
        onChange: function onChange(e) {
          return _onChange(e.target.value);
        }
      });
    }
  }]);
  return ColorType;
}(_react2.default.Component);

ColorType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

ColorType.serialize = function (value) {
  return value;
};

ColorType.deserialize = function (value) {
  return value;
};

exports.default = ColorType;