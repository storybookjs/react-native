'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _reactTextareaAutosize = require('react-textarea-autosize');

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
  fontFamily: 'monospace'
};

var ObjectType = function (_React$Component) {
  (0, _inherits3.default)(ObjectType, _React$Component);

  function ObjectType() {
    var _ref;

    (0, _classCallCheck3.default)(this, ObjectType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = ObjectType.__proto__ || (0, _getPrototypeOf2.default)(ObjectType)).call.apply(_ref, [this].concat(args)));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(ObjectType, [{
    key: 'getJSONString',
    value: function getJSONString() {
      var _state = this.state,
          json = _state.json,
          jsonString = _state.jsonString;
      var knob = this.props.knob;

      // If there is an error in the JSON, we need to give that errored JSON.

      if (this.failed) return jsonString;

      // If the editor value and the knob value is the same, we need to return the
      // editor value as it allow user to add new fields to the JSON.
      if ((0, _deepEqual2.default)(json, knob.value)) return jsonString;

      // If the knob's value is different from the editor, it seems like
      // there's a outside change and we need to get that.
      return (0, _stringify2.default)(knob.value, null, 2);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      var onChange = this.props.onChange;

      var newState = {
        jsonString: e.target.value
      };

      try {
        newState.json = JSON.parse(e.target.value.trim());
        onChange(newState.json);
        this.failed = false;
      } catch (err) {
        this.failed = true;
      }

      this.setState(newState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var knob = this.props.knob;

      var jsonString = this.getJSONString();
      var extraStyle = {};

      if (this.failed) {
        extraStyle.border = '1px solid #fadddd';
        extraStyle.backgroundColor = '#fff5f5';
      }

      return _react2.default.createElement(_reactTextareaAutosize2.default, {
        id: knob.name,
        ref: 'input',
        style: (0, _extends3.default)({}, styles, extraStyle),
        value: jsonString,
        onChange: function onChange(e) {
          return _this2.handleChange(e);
        }
      });
    }
  }]);
  return ObjectType;
}(_react2.default.Component);

ObjectType.propTypes = {
  knob: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

ObjectType.serialize = function (object) {
  return (0, _stringify2.default)(object);
};

ObjectType.deserialize = function (value) {
  if (!value) return {};
  return JSON.parse(value);
};

exports.default = ObjectType;