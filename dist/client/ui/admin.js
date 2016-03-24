'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderAdmin;
exports.getControls = getControls;
exports.getIframe = getIframe;
exports.getActionLogger = getActionLogger;
exports.renderMain = renderMain;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _controls = require('./controls');

var _controls2 = _interopRequireDefault(_controls);

var _action_logger = require('./action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _data = require('../data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');

function renderAdmin(data) {
  return renderMain(data);
}

function getControls(data) {
  return _react2.default.createElement(_controls2.default, {
    storybook: data.storybook,
    selectedKind: data.selectedKind,
    selectedStory: data.selectedStory,
    onKind: setSelectedKind.bind(null, data),
    onStory: setSelectedStory.bind(null, data) });
}

function getIframe(data) {
  var iframeStyle = {
    width: '100%',
    height: '100%',
    border: '0'
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  var queryString = 'dataId=' + data.dataId;

  return _react2.default.createElement('iframe', {
    style: iframeStyle,
    src: '/iframe?' + queryString });
}

function getActionLogger(data) {
  var _data$actions = data.actions;
  var actions = _data$actions === undefined ? [] : _data$actions;

  var log = actions.map(function (action) {
    return (0, _jsonStringifySafe2.default)(action, null, 2);
  }).join('\n\n');

  return _react2.default.createElement(_action_logger2.default, { actionLog: log });
}

function renderMain(data) {
  // Inside the main page, we simply render iframe.
  var controls = getControls(data);
  var iframe = getIframe(data);
  var actionLogger = getActionLogger(data);

  var root = _react2.default.createElement(_layout2.default, {
    controls: controls,
    preview: iframe,
    actionLogger: actionLogger });

  _reactDom2.default.render(root, rootEl);
}

// Event handlers
function setSelectedKind(data, kind) {
  data.selectedKind = kind;
  data.selectedStory = data.storybook[kind][0];
  (0, _data.setData)(data);
}

function setSelectedStory(data, block) {
  data.selectedStory = block;
  (0, _data.setData)(data);
}