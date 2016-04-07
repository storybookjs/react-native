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

var _layout_vsplit = require('./layout_vsplit');

var _layout_vsplit2 = _interopRequireDefault(_layout_vsplit);

var _layout_hsplit = require('./layout_hsplit');

var _layout_hsplit2 = _interopRequireDefault(_layout_hsplit);

var _reactSplitPane = require('@mnmtanish/react-split-pane');

var _reactSplitPane2 = _interopRequireDefault(_reactSplitPane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = function (_React$Component) {
  (0, _inherits3.default)(Layout, _React$Component);

  function Layout() {
    (0, _classCallCheck3.default)(this, Layout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Layout).apply(this, arguments));
  }

  (0, _createClass3.default)(Layout, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var controls = _props.controls;
      var preview = _props.preview;
      var actionLogger = _props.actionLogger;


      var rootStyles = {
        height: '100vh',
        backgroundColor: '#F7F7F7'
      };

      var controlsStyle = {
        height: '100%',
        overflowY: 'auto',
        padding: '5px 0 5px 10px',
        boxSizing: 'border-box'
      };

      var actionStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        padding: '5px 10px 10px 0',
        boxSizing: 'border-box'
      };

      var previewStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        padding: '10px 10px 10px 0',
        boxSizing: 'border-box'
      };

      var vsplit = _react2.default.createElement(_layout_vsplit2.default, null);
      var hsplit = _react2.default.createElement(_layout_hsplit2.default, null);

      var onDragStart = function onDragStart() {
        document.body.classList.add('dragging');
      };

      var onDragEnd = function onDragEnd() {
        document.body.classList.remove('dragging');
      };

      return _react2.default.createElement(
        'div',
        { style: rootStyles },
        _react2.default.createElement(
          _reactSplitPane2.default,
          { split: 'vertical', minSize: 250, resizerChildren: vsplit, onDragStarted: onDragStart, onDragFinished: onDragEnd },
          _react2.default.createElement(
            'div',
            { style: controlsStyle },
            controls
          ),
          _react2.default.createElement(
            _reactSplitPane2.default,
            { split: 'horizontal', primary: 'second', minSize: 100, defaultSize: 200, resizerChildren: hsplit, onDragStarted: onDragStart, onDragFinished: onDragEnd },
            _react2.default.createElement(
              'div',
              { style: previewStyle },
              preview
            ),
            _react2.default.createElement(
              'div',
              { style: actionStyle },
              actionLogger
            )
          )
        )
      );
    }
  }]);
  return Layout;
}(_react2.default.Component);

Layout.propTypes = {
  controls: _react2.default.PropTypes.element.isRequired,
  preview: _react2.default.PropTypes.element.isRequired,
  actionLogger: _react2.default.PropTypes.element.isRequired
};

exports.default = Layout;