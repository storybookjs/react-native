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

var _PropField = require('./PropField');

var _PropField2 = _interopRequireDefault(_PropField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stylesheet = {
  propForm: {
    fontFamily: '\n      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n    ',
    display: 'table',
    boxSizing: 'border-box',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '5px'
  }
};

var propForm = function (_React$Component) {
  (0, _inherits3.default)(propForm, _React$Component);

  function propForm() {
    (0, _classCallCheck3.default)(this, propForm);

    var _this = (0, _possibleConstructorReturn3.default)(this, (propForm.__proto__ || (0, _getPrototypeOf2.default)(propForm)).call(this));

    _this._onFieldChange = _this.onFieldChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(propForm, [{
    key: 'onFieldChange',
    value: function onFieldChange(name, type, value) {
      var change = { name: name, type: type, value: value };
      this.props.onFieldChange(change);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var knobs = this.props.knobs;

      return _react2.default.createElement(
        'form',
        { style: stylesheet.propForm },
        knobs.map(function (knob) {
          return _react2.default.createElement(_PropField2.default, {
            key: knob.name,
            name: knob.name,
            type: knob.type,
            value: knob.value,
            knob: knob,
            onChange: _this2._onFieldChange.bind(null, knob.name, knob.type)
          });
        })
      );
    }
  }]);
  return propForm;
}(_react2.default.Component);

exports.default = propForm;


propForm.displayName = 'propForm';

propForm.propTypes = {
  knobs: _react2.default.PropTypes.array.isRequired,
  onFieldChange: _react2.default.PropTypes.func.isRequired
};