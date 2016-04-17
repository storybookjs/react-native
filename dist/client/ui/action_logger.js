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

var _foldable = require('./foldable');

var _foldable2 = _interopRequireDefault(_foldable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: 0,
  position: 'absolute',
  top: '30px',
  right: 0,
  bottom: 0,
  left: 0
};

var wrapStyle = {
  position: 'relative',
  height: '100%'
};

var headStyle = {
  fontFamily: '\n    -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n    "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n  ',
  color: '#444',
  letterSpacing: '2px',
  fontSize: 12,
  margin: '0 0 0 5px'
};

var btnStyle = {
  marginLeft: 5
};

var ActionLogger = function (_Component) {
  (0, _inherits3.default)(ActionLogger, _Component);

  function ActionLogger() {
    (0, _classCallCheck3.default)(this, ActionLogger);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ActionLogger).apply(this, arguments));
  }

  (0, _createClass3.default)(ActionLogger, [{
    key: 'getActionData',
    value: function getActionData() {
      return this.props.actions.map(function (action) {
        return _react2.default.createElement(_foldable2.default, { key: action.id, action: action });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var onClear = this.props.onClear;

      return _react2.default.createElement(
        'div',
        { style: wrapStyle },
        _react2.default.createElement(
          'h3',
          { style: headStyle },
          'ACTION LOGGER',
          _react2.default.createElement(
            'button',
            { style: btnStyle, onClick: onClear },
            'CLEAR'
          )
        ),
        _react2.default.createElement(
          'pre',
          { style: preStyle },
          this.getActionData()
        )
      );
    }
  }]);
  return ActionLogger;
}(_react.Component);

ActionLogger.propTypes = {
  onClear: _react2.default.PropTypes.func,
  actions: _react2.default.PropTypes.array
};

exports.default = ActionLogger;