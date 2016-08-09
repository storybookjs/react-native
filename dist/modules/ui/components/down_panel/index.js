'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DownPanel = function (_Component) {
  (0, _inherits3.default)(DownPanel, _Component);

  function DownPanel(props) {
    var _Object$getPrototypeO;

    (0, _classCallCheck3.default)(this, DownPanel);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(DownPanel)).call.apply(_Object$getPrototypeO, [this, props].concat(args)));

    _this.state = { current: (0, _keys2.default)(props.panels)[0] };
    return _this;
  }

  (0, _createClass3.default)(DownPanel, [{
    key: 'showPanel',
    value: function showPanel(name) {
      this.setState({ current: name });
    }
  }, {
    key: 'renderTab',
    value: function renderTab(name, panel) {
      var _this2 = this;

      var tabStyle = _style2.default.tablink;
      if (this.state.current === name) {
        tabStyle = (0, _assign2.default)({}, _style2.default.tablink, _style2.default.activetab);
      }

      var onClick = function onClick() {
        return function (e) {
          e.preventDefault();
          _this2.showPanel(name);
        };
      };

      return _react2.default.createElement(
        'a',
        {
          href: '#',
          key: name,
          style: tabStyle,
          onClick: onClick()
        },
        panel.title
      );
    }
  }, {
    key: 'renderTabs',
    value: function renderTabs() {
      var _this3 = this;

      return (0, _keys2.default)(this.props.panels).map(function (name) {
        var panel = _this3.props.panels[name];
        return _this3.renderTab(name, panel);
      });
    }
  }, {
    key: 'renderPanels',
    value: function renderPanels() {
      var _this4 = this;

      return (0, _keys2.default)(this.props.panels).sort().map(function (name) {
        var panelStyle = { display: 'none' };
        var panel = _this4.props.panels[name];
        if (name === _this4.state.current) {
          (0, _assign2.default)(panelStyle, { flex: 1, display: 'flex' });
        }
        return _react2.default.createElement(
          'div',
          { key: name, style: panelStyle },
          panel.render()
        );
      });
    }
  }, {
    key: 'renderEmpty',
    value: function renderEmpty() {
      return _react2.default.createElement(
        'div',
        { style: _style2.default.empty },
        'no panels available'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.panels || !(0, _keys2.default)(this.props.panels).length) {
        return this.renderEmpty();
      }
      return _react2.default.createElement(
        'div',
        { style: _style2.default.wrapper },
        _react2.default.createElement(
          'div',
          { style: _style2.default.tabbar },
          this.renderTabs()
        ),
        _react2.default.createElement(
          'div',
          { style: _style2.default.content },
          this.renderPanels()
        )
      );
    }
  }]);
  return DownPanel;
}(_react.Component);

DownPanel.propTypes = {
  panels: _react2.default.PropTypes.object
};

exports.default = DownPanel;