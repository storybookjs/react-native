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
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555'
};

var BooleanType = function (_React$Component) {
  (0, _inherits3.default)(BooleanType, _React$Component);

  function BooleanType() {
    (0, _classCallCheck3.default)(this, BooleanType);
    return (0, _possibleConstructorReturn3.default)(this, (BooleanType.__proto__ || (0, _getPrototypeOf2.default)(BooleanType)).apply(this, arguments));
  }

  (0, _createClass3.default)(BooleanType, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;


      return _react2.default.createElement('input', {
        id: knob.name,
        ref: 'input',
        style: styles,
        type: 'checkbox',
        onChange: function onChange() {
          return _onChange(_this2.refs.input.checked);
        },
        checked: knob.value
      });
    }
  }]);
  return BooleanType;
}(_react2.default.Component);

BooleanType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

BooleanType.serialize = function (value) {
  return String(value);
};

BooleanType.deserialize = function (value) {
  if (!value) return false;
  return value.trim() === 'true';
};

exports.default = BooleanType;