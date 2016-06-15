'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

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

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropTypesMap = new _map2.default();
for (var typeName in _react2.default.PropTypes) {
  if (!_react2.default.PropTypes.hasOwnProperty(typeName)) {
    continue;
  }
  var type = _react2.default.PropTypes[typeName];
  PropTypesMap.set(type, typeName);
}

var PropTable = function (_React$Component) {
  (0, _inherits3.default)(PropTable, _React$Component);

  function PropTable() {
    (0, _classCallCheck3.default)(this, PropTable);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PropTable).apply(this, arguments));
  }

  (0, _createClass3.default)(PropTable, [{
    key: 'render',
    value: function render() {
      var comp = this.props.comp;

      if (!comp) {
        return null;
      }

      var props = {};

      if (comp.propTypes) {
        for (var property in comp.propTypes) {
          if (!comp.propTypes.hasOwnProperty(property)) {
            continue;
          }
          var _type = comp.propTypes[property];
          var propType = PropTypesMap.get(_type) || 'other';
          var required = _type.isRequired === undefined ? 'yes' : 'no';
          var defaultValue = '-';
          props[property] = { property: property, propType: propType, required: required, defaultValue: defaultValue };
        }
      }

      if (comp.defaultProps) {
        for (var _property in comp.defaultProps) {
          if (!comp.defaultProps.hasOwnProperty(_property)) {
            continue;
          }
          var value = comp.defaultProps[_property];
          if (value === undefined) {
            continue;
          }
          if (!props[_property]) {
            props[_property] = { property: _property };
          }
          props[_property].defaultValue = value;
        }
      }

      return _react2.default.createElement(
        'table',
        null,
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              null,
              'property'
            ),
            _react2.default.createElement(
              'th',
              null,
              'propType'
            ),
            _react2.default.createElement(
              'th',
              null,
              'required'
            ),
            _react2.default.createElement(
              'th',
              null,
              'default'
            )
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          (0, _values2.default)(props).map(function (row) {
            return _react2.default.createElement(
              'tr',
              { key: row.property },
              _react2.default.createElement(
                'td',
                null,
                row.property
              ),
              _react2.default.createElement(
                'td',
                null,
                row.propType
              ),
              _react2.default.createElement(
                'td',
                null,
                row.required
              ),
              _react2.default.createElement(
                'td',
                null,
                row.defaultValue.toString()
              )
            );
          })
        )
      );
    }
  }]);
  return PropTable;
}(_react2.default.Component);

PropTable.displayName = 'PropTable';
PropTable.propTypes = {
  comp: _react2.default.PropTypes.func
};
exports.default = PropTable;