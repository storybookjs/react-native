'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _Props = require('./Props');

var _Props2 = _interopRequireDefault(_Props);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stylesheet = {
  containerStyle: {},
  tagStyle: {
    color: '#777'
  }
};

var Node = function (_React$Component) {
  (0, _inherits3.default)(Node, _React$Component);

  function Node(props) {
    (0, _classCallCheck3.default)(this, Node);
    return (0, _possibleConstructorReturn3.default)(this, (Node.__proto__ || (0, _getPrototypeOf2.default)(Node)).call(this, props));
  }

  (0, _createClass3.default)(Node, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          node = _props.node,
          depth = _props.depth;
      var tagStyle = stylesheet.tagStyle,
          containerStyle = stylesheet.containerStyle;


      var leftPad = {
        paddingLeft: 3 + (depth + 1) * 15,
        paddingRight: 3
      };

      (0, _assign2.default)(containerStyle, leftPad);

      var _getData = getData(node),
          name = _getData.name,
          text = _getData.text,
          children = _getData.children;

      // Just text


      if (!name) {
        return _react2.default.createElement(
          'div',
          { style: containerStyle },
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            text
          )
        );
      }

      // Single-line tag
      if (!children) {
        return _react2.default.createElement(
          'div',
          { style: containerStyle },
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            '<',
            name
          ),
          _react2.default.createElement(_Props2.default, { node: node, singleLine: true }),
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            '/>'
          )
        );
      }

      // Keep a copy so that further mutations to containerStyle don't impact us:
      var containerStyleCopy = (0, _assign2.default)({}, containerStyle);

      // tag with children
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: containerStyleCopy },
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            '<',
            name
          ),
          _react2.default.createElement(_Props2.default, { node: node }),
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            '>'
          )
        ),
        _react2.default.Children.map(children, function (childElement) {
          return _react2.default.createElement(Node, { node: childElement, depth: depth + 1 });
        }),
        _react2.default.createElement(
          'div',
          { style: containerStyleCopy },
          _react2.default.createElement(
            'span',
            { style: tagStyle },
            '</',
            name,
            '>'
          )
        )
      );
    }
  }]);
  return Node;
}(_react2.default.Component);

exports.default = Node;


function getData(element) {
  var data = {
    name: null,
    text: null,
    children: null
  };

  if (typeof element == 'string') {
    data.text = element;
    return data;
  }

  if (typeof element === 'number') {
    data.text = String.toString(element);
    return data;
  }

  data.children = element.props.children;
  var type = element.type;

  if (typeof type === 'string') {
    data.name = type;
  } else {
    data.name = type.displayName || type.name || 'Unknown';
  }

  return data;
}