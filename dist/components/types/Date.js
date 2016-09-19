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

var _reactDatetime = require('react-datetime');

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

var _insertCss = require('insert-css');

var _insertCss2 = _interopRequireDefault(_insertCss);

var _DateStyle = require('./Date-style');

var _DateStyle2 = _interopRequireDefault(_DateStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _insertCss2.default)(_DateStyle2.default);

var DateType = function (_React$Component) {
  (0, _inherits3.default)(DateType, _React$Component);

  function DateType() {
    (0, _classCallCheck3.default)(this, DateType);
    return (0, _possibleConstructorReturn3.default)(this, (DateType.__proto__ || (0, _getPrototypeOf2.default)(DateType)).apply(this, arguments));
  }

  (0, _createClass3.default)(DateType, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var knob = _props.knob;
      var _onChange = _props.onChange;

      return _react2.default.createElement(_reactDatetime2.default, {
        id: knob.name,
        value: new Date(knob.value),
        type: 'date',
        onChange: function onChange(date) {
          return _onChange(date.valueOf());
        }
      });
    }
  }]);
  return DateType;
}(_react2.default.Component);

DateType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

DateType.serialize = function (value) {
  return String(value);
};

DateType.deserialize = function (value) {
  return parseFloat(value);
};

exports.default = DateType;