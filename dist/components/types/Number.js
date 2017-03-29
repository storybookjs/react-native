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
  padding: '5px',
  color: '#444'
};

var NumberType = function (_React$Component) {
  (0, _inherits3.default)(NumberType, _React$Component);

  function NumberType(props) {
    (0, _classCallCheck3.default)(this, NumberType);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NumberType.__proto__ || (0, _getPrototypeOf2.default)(NumberType)).call(this, props));

    _this.renderNormal = _this.renderNormal.bind(_this);
    _this.renderRange = _this.renderRange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(NumberType, [{
    key: 'renderNormal',
    value: function renderNormal() {
      var _this2 = this;

      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;


      return _react2.default.createElement('input', {
        id: knob.name,
        ref: 'input',
        style: styles,
        value: knob.value,
        type: 'number',
        onChange: function onChange() {
          return _onChange(parseFloat(_this2.refs.input.value));
        }
      });
    }
  }, {
    key: 'renderRange',
    value: function renderRange() {
      var _this3 = this;

      var _props2 = this.props,
          knob = _props2.knob,
          _onChange2 = _props2.onChange;


      return _react2.default.createElement('input', {
        id: knob.name,
        ref: 'input',
        style: styles,
        value: knob.value,
        type: 'range',
        min: knob.min,
        max: knob.max,
        step: knob.step,
        onChange: function onChange() {
          return _onChange2(parseFloat(_this3.refs.input.value));
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var knob = this.props.knob;


      return knob.range ? this.renderRange() : this.renderNormal();
    }
  }]);
  return NumberType;
}(_react2.default.Component);

NumberType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

NumberType.serialize = function (value) {
  return String(value);
};

NumberType.deserialize = function (value) {
  return parseFloat(value);
};

exports.default = NumberType;