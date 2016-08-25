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

var StoryView = function (_Component) {
  (0, _inherits3.default)(StoryView, _Component);

  function StoryView(props) {
    var _ref;

    (0, _classCallCheck3.default)(this, StoryView);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = StoryView.__proto__ || (0, _getPrototypeOf2.default)(StoryView)).call.apply(_ref, [this, props].concat(args)));

    _this.state = { storyFn: function storyFn() {
        return null;
      } };
    _this.props.events.on('story', function (storyFn) {
      return _this.setState({ storyFn: storyFn });
    });
    return _this;
  }

  (0, _createClass3.default)(StoryView, [{
    key: 'render',
    value: function render() {
      return this.state.storyFn();
    }
  }]);
  return StoryView;
}(_react.Component);

exports.default = StoryView;