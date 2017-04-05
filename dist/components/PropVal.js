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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var valueStyles = {
  func: {
    color: '#170'
  },

  attr: {
    color: '#666'
  },

  object: {
    color: '#666'
  },

  array: {
    color: '#666'
  },

  number: {
    color: '#a11'
  },

  string: {
    color: '#22a',
    wordBreak: 'break-word'
  },

  bool: {
    color: '#a11'
  },

  empty: {
    color: '#777'
  }
};

function previewArray(val) {
  var items = {};
  val.slice(0, 3).forEach(function (item, i) {
    items['n' + i] = _react2.default.createElement(PropVal, { val: item });
    items['c' + i] = ', ';
  });
  if (val.length > 3) {
    items.last = '…';
  } else {
    delete items['c' + (val.length - 1)];
  }
  return _react2.default.createElement(
    'span',
    { style: valueStyles.array },
    '[',
    (0, _reactAddonsCreateFragment2.default)(items),
    ']'
  );
}

function previewObject(val) {
  var names = (0, _keys2.default)(val);
  var items = {};
  names.slice(0, 3).forEach(function (name, i) {
    items['k' + i] = _react2.default.createElement(
      'span',
      { style: valueStyles.attr },
      name
    );
    items['c' + i] = ': ';
    items['v' + i] = _react2.default.createElement(PropVal, { val: val[name] });
    items['m' + i] = ', ';
  });
  if (names.length > 3) {
    items.rest = '…';
  } else {
    delete items['m' + (names.length - 1)];
  }
  return _react2.default.createElement(
    'span',
    { style: valueStyles.object },
    '{',
    (0, _reactAddonsCreateFragment2.default)(items),
    '}'
  );
}

function previewProp(val) {
  var braceWrap = true;
  var content = null;
  if (typeof val === 'number') {
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.number },
      val
    );
  } else if (typeof val === 'string') {
    if (val.length > 50) {
      val = val.slice(0, 50) + '…';
    }
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.string },
      '"',
      val,
      '"'
    );
    braceWrap = false;
  } else if (typeof val === 'boolean') {
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.bool },
      '' + val
    );
  } else if (Array.isArray(val)) {
    content = previewArray(val);
  } else if (typeof val === 'function') {
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.func },
      val.name ? val.name + '()' : 'anonymous()'
    );
  } else if (!val) {
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.empty },
      '' + val
    );
  } else if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) !== 'object') {
    content = _react2.default.createElement(
      'span',
      null,
      '\u2026'
    );
  } else if (_react2.default.isValidElement(val)) {
    content = _react2.default.createElement(
      'span',
      { style: valueStyles.object },
      '<' + (val.type.displayName || val.type.name || val.type) + ' />'
    );
  } else {
    content = previewObject(val);
  }

  if (!braceWrap) return content;
  return _react2.default.createElement(
    'span',
    null,
    '{',
    content,
    '}'
  );
}

var PropVal = function (_React$Component) {
  (0, _inherits3.default)(PropVal, _React$Component);

  function PropVal() {
    (0, _classCallCheck3.default)(this, PropVal);
    return (0, _possibleConstructorReturn3.default)(this, (PropVal.__proto__ || (0, _getPrototypeOf2.default)(PropVal)).apply(this, arguments));
  }

  (0, _createClass3.default)(PropVal, [{
    key: 'render',
    value: function render() {
      return previewProp(this.props.val);
    }
  }]);
  return PropVal;
}(_react2.default.Component);

exports.default = PropVal;


module.exports = PropVal;