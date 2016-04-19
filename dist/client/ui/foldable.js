'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _highlight = require('./highlight');

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var folderStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '10px',
  backgroundColor: 'white',
  transition: 'background-color .2s ease-in'
};

var folderSidebarStyle = {
  display: 'block',
  width: '10px',
  float: 'left',
  height: '100%',
  color: '#ccc',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  MozUserSelect: 'none',
  cursor: 'pointer'
};

var folderContentStyle = {
  display: 'inline-block',
  clear: 'right',
  marginLeft: '5px',
  padding: '0px',
  paddingLeft: '5px',
  width: 'auto'
};

var Foldable = function (_React$Component) {
  (0, _inherits3.default)(Foldable, _React$Component);

  function Foldable(props) {
    (0, _classCallCheck3.default)(this, Foldable);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Foldable).call(this, props));

    _this.state = {
      collapsed: true
    };
    _this.onToggleCallback = _this.onToggle.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Foldable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.refs.folder.style.backgroundColor = '#FFFCE0';
      setTimeout(function () {
        _this2.refs.folder.style.backgroundColor = folderStyle.backgroundColor;
      }, 500);
    }
  }, {
    key: 'onToggle',
    value: function onToggle() {
      this.setState({ collapsed: !this.state.collapsed });
    }
  }, {
    key: 'render',
    value: function render() {
      var action = (0, _extends3.default)({}, this.props.action);
      delete action.id;
      var content = void 0;

      if (this.state.collapsed) {
        // return the shortest string representation possible
        content = (0, _jsonStringifySafe2.default)(action);
      } else {
        content = (0, _jsonStringifySafe2.default)(action, null, 2);
      }

      return _react2.default.createElement(
        'div',
        { ref: 'folder', style: folderStyle },
        _react2.default.createElement(
          'div',
          { style: folderSidebarStyle },
          _react2.default.createElement(
            'span',
            { ref: 'foldable-toggle', onClick: this.onToggleCallback },
            this.state.collapsed ? '►' : '▼'
          )
        ),
        _react2.default.createElement('div', { ref: 'foldable-content', style: folderContentStyle,
          dangerouslySetInnerHTML: { __html: (0, _highlight2.default)(content) }
        })
      );
    }
  }]);
  return Foldable;
}(_react2.default.Component);

Foldable.propTypes = {
  action: _react2.default.PropTypes.object
};

exports.default = Foldable;