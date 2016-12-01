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

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customStyle = '\n  .rdt input {\n    outline: 0;\n    width: 100%;\n    border: 1px solid #f7f4f4;\n    border-radius: 2px;\n    font-size: 11px;\n    padding: 5px;\n    color: #555;\n    display: table-cell;\n    box-sizing: border-box;\n  }\n';

(0, _insertCss2.default)(_styles2.default);
(0, _insertCss2.default)(customStyle);

var DateType = function (_React$Component) {
  (0, _inherits3.default)(DateType, _React$Component);

  function DateType() {
    (0, _classCallCheck3.default)(this, DateType);
    return (0, _possibleConstructorReturn3.default)(this, (DateType.__proto__ || (0, _getPrototypeOf2.default)(DateType)).apply(this, arguments));
  }

  (0, _createClass3.default)(DateType, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_reactDatetime2.default, {
          id: knob.name,
          value: knob.value ? new Date(knob.value) : null,
          type: 'date',
          onChange: function onChange(date) {
            return _onChange(date.valueOf());
          }
        })
      );
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