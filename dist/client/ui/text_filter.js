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

var TextFilter = function (_React$Component) {
  (0, _inherits3.default)(TextFilter, _React$Component);

  function TextFilter() {
    (0, _classCallCheck3.default)(this, TextFilter);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TextFilter).apply(this, arguments));
  }

  (0, _createClass3.default)(TextFilter, [{
    key: 'onChange',
    value: function onChange(event) {
      var filterText = event.target.value;
      this.props.onChange(filterText);
    }
  }, {
    key: 'render',
    value: function render() {
      var mainStyle = {
        border: '1px solid #ECECEC',
        borderRadius: 2
      };

      var filterTextWrapStyle = {
        background: '#F7F7F7',
        paddingRight: 25
      };

      var filterTextStyle = {
        fontSize: 12,
        color: '#828282',
        border: 'none',
        padding: 5,
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none'
      };

      var clearButtonStyle = {
        position: 'absolute',
        color: '#B1B1B1',
        border: 'none',
        padding: 3,
        width: 25,
        right: 0,
        top: 0,
        textAlign: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer'
      };

      return _react2.default.createElement(
        'div',
        { style: mainStyle },
        _react2.default.createElement(
          'div',
          { style: filterTextWrapStyle },
          _react2.default.createElement('input', {
            style: filterTextStyle,
            type: 'text',
            placeholder: 'Filter',
            name: 'filter-text',
            value: this.props.filterText,
            onChange: this.onChange.bind(this)
          })
        ),
        _react2.default.createElement(
          'div',
          {
            style: clearButtonStyle,
            onClick: this.props.onClear
          },
          'x'
        )
      );
    }
  }]);
  return TextFilter;
}(_react2.default.Component);

exports.default = TextFilter;


TextFilter.propTypes = {
  filterText: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onClear: _react2.default.PropTypes.func
};