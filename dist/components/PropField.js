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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InvalidType = function InvalidType() {
  return _react2.default.createElement(
    'span',
    null,
    'Invalid Type'
  );
};

var stylesheet = {
  field: {
    display: 'table-row',
    padding: '5px'
  },
  label: {
    display: 'table-cell',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    paddingRight: 5,
    paddingTop: 7,
    textAlign: 'right',
    width: 80,
    fontSize: 10,
    color: 'rgb(68, 68, 68)',
    textTransform: 'uppercase',
    fontWeight: 600
  }
};

stylesheet.textarea = (0, _extends3.default)({}, stylesheet.input, {
  height: '100px'
});

stylesheet.checkbox = (0, _extends3.default)({}, stylesheet.input, {
  width: 'auto'
});

var PropField = function (_React$Component) {
  (0, _inherits3.default)(PropField, _React$Component);

  function PropField(props) {
    (0, _classCallCheck3.default)(this, PropField);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PropField.__proto__ || (0, _getPrototypeOf2.default)(PropField)).call(this, props));

    _this._onChange = _this.onChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(PropField, [{
    key: 'onChange',
    value: function onChange(e) {
      this.props.onChange(e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onChange = _props.onChange,
          knob = _props.knob;


      var InputType = _types2.default[knob.type] || InvalidType;

      return _react2.default.createElement(
        'div',
        { style: stylesheet.field },
        _react2.default.createElement(
          'label',
          { htmlFor: knob.name, style: stylesheet.label },
          '' + knob.name
        ),
        _react2.default.createElement(InputType, {
          knob: knob,
          onChange: onChange
        })
      );
    }
  }]);
  return PropField;
}(_react2.default.Component);

exports.default = PropField;


PropField.propTypes = {
  onChange: _react2.default.PropTypes.func.isRequired,
  knob: _react2.default.PropTypes.object
};