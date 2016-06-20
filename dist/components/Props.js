'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _PropVal = require('./PropVal');

var _PropVal2 = _interopRequireDefault(_PropVal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stylesheet = {
  propStyle: {
    paddingLeft: 8
  },
  propNameStyle: {},
  propValueStyle: {}
};

var Props = function (_React$Component) {
  (0, _inherits3.default)(Props, _React$Component);

  function Props() {
    (0, _classCallCheck3.default)(this, Props);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Props).apply(this, arguments));
  }

  (0, _createClass3.default)(Props, [{
    key: 'render',
    value: function render() {
      var props = this.props.node.props;
      var defaultProps = this.props.node.type.defaultProps;
      if (!props || (typeof props === 'undefined' ? 'undefined' : (0, _typeof3.default)(props)) !== 'object') {
        return _react2.default.createElement('span', null);
      }

      var propStyle = stylesheet.propStyle;
      var propValueStyle = stylesheet.propValueStyle;
      var propNameStyle = stylesheet.propNameStyle;


      var names = (0, _keys2.default)(props).filter(function (name) {
        return name[0] !== '_' && name !== 'children' && (!defaultProps || props[name] != defaultProps[name]);
      });

      var items = [];
      names.slice(0, 3).forEach(function (name) {
        items.push(_react2.default.createElement(
          'span',
          { style: propStyle },
          _react2.default.createElement(
            'span',
            { style: propNameStyle },
            name
          ),
          '=',
          _react2.default.createElement(
            'span',
            { style: propValueStyle },
            _react2.default.createElement(_PropVal2.default, { val: props[name] })
          )
        ));
      });

      return _react2.default.createElement(
        'span',
        null,
        items
      );
    }
  }]);
  return Props;
}(_react2.default.Component);

exports.default = Props;