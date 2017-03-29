'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
  color: '#555'
};

var SelectType = function (_React$Component) {
  (0, _inherits3.default)(SelectType, _React$Component);

  function SelectType() {
    (0, _classCallCheck3.default)(this, SelectType);
    return (0, _possibleConstructorReturn3.default)(this, (SelectType.__proto__ || (0, _getPrototypeOf2.default)(SelectType)).apply(this, arguments));
  }

  (0, _createClass3.default)(SelectType, [{
    key: '_makeOpt',
    value: function _makeOpt(key, val) {
      var opts = {
        key: key,
        value: key
      };

      return _react2.default.createElement(
        'option',
        opts,
        val
      );
    }
  }, {
    key: '_options',
    value: function _options(values) {
      var _this2 = this;

      var data = [];
      if (Array.isArray(values)) {
        data = values.map(function (val) {
          return _this2._makeOpt(val, val);
        });
      } else {
        data = (0, _keys2.default)(values).map(function (key) {
          return _this2._makeOpt(key, values[key]);
        });
      }

      return data;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;


      return _react2.default.createElement(
        'select',
        {
          id: knob.name,
          ref: 'input',
          style: styles,
          value: knob.value,
          onChange: function onChange(e) {
            return _onChange(e.target.value);
          }
        },
        this._options(knob.options)
      );
    }
  }]);
  return SelectType;
}(_react2.default.Component);

SelectType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

SelectType.serialize = function (value) {
  return value;
};

SelectType.deserialize = function (value) {
  return value;
};

exports.default = SelectType;