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

var HSplit = function (_Component) {
  (0, _inherits3.default)(HSplit, _Component);

  function HSplit() {
    var _Object$getPrototypeO;

    (0, _classCallCheck3.default)(this, HSplit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(HSplit)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(HSplit, [{
    key: 'render',
    value: function render() {
      var wrapStyle = {
        cursor: 'row-resize',
        width: '100%',
        height: '10px',
        marginTop: '-10px',
        marginBottom: '-10px',
        position: 'relative'
      };

      var spanStyle = {
        height: '1px',
        width: '20px',
        top: '5px',
        left: '50%',
        marginLeft: '-10px',
        position: 'absolute',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
        borderBottom: 'solid 1px rgba(0,0,0,0.1)'
      };

      return _react2.default.createElement(
        'div',
        { style: wrapStyle },
        _react2.default.createElement('span', { style: spanStyle })
      );
    }
  }]);
  return HSplit;
}(_react.Component);

exports.default = HSplit;