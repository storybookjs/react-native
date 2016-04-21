'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.getControls = getControls;
exports.getIframe = getIframe;
exports.getActionLogger = getActionLogger;
exports.renderMain = renderMain;
exports.default = renderAdmin;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _controls = require('./controls');

var _controls2 = _interopRequireDefault(_controls);

var _action_logger = require('./action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');
var syncedStore = (0, _.getSyncedStore)();

// Event handlers
function setSelectedKind(data, kind, story) {
  var newData = (0, _extends3.default)({}, data);
  var stories = newData.storyStore.find(function (item) {
    return item.kind === kind;
  }).stories;

  newData.selectedKind = kind;
  newData.selectedStory = story || stories[0];
  syncedStore.setData(newData);
}

function setSelectedStory(data, block) {
  var newData = (0, _extends3.default)({}, data);
  newData.selectedStory = block;
  syncedStore.setData(newData);
}

function clearLogs() {
  var data = syncedStore.getData();
  data.actions = [];
  syncedStore.setData(data);
}

function getControls(data) {
  return _react2.default.createElement(_controls2.default, {
    storyStore: data.storyStore,
    selectedKind: data.selectedKind,
    selectedStory: data.selectedStory,
    onKind: setSelectedKind.bind(null, data),
    onStory: setSelectedStory.bind(null, data)
  });
}

function getIframe(data) {
  var iframeStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #ECECEC',
    borderRadius: 4,
    backgroundColor: '#FFF'
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  var queryString = 'dataId=' + data.dataId;

  return _react2.default.createElement('iframe', {
    style: iframeStyle,
    src: 'iframe.html?' + queryString
  });
}

function getActionLogger(data) {
  var _data$actions = data.actions;
  var actions = _data$actions === undefined ? [] : _data$actions;

  return _react2.default.createElement(_action_logger2.default, { actions: actions, onClear: clearLogs });
}

function renderMain(data) {
  // Inside the main page, we simply render iframe.
  var controls = getControls(data);
  var iframe = getIframe(data);
  var actionLogger = getActionLogger(data);

  var root = _react2.default.createElement(_layout2.default, {
    controls: controls,
    preview: iframe,
    actionLogger: actionLogger
  });

  _reactDom2.default.render(root, rootEl);
}

function renderAdmin(data) {
  return renderMain(data);
}