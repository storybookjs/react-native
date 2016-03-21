'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = renderUI;
exports.getControls = getControls;
exports.getIframe = getIframe;
exports.renderError = renderError;
exports.renderMain = renderMain;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

var _controls = require('./controls');

var _controls2 = _interopRequireDefault(_controls);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _data = require('../data');

var _storybook = require('../storybook');

var _storybook2 = _interopRequireDefault(_storybook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');

function renderUI(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  // default main
  var main = _react2.default.createElement(
    'p',
    null,
    'There is no blocks yet!'
  );

  var stories = _storybook2.default[data.selectedKind];
  if (stories) {
    var story = _storybook2.default[data.selectedKind][data.selectedStory];
    if (story) {
      try {
        main = story();
      } catch (error) {
        return (0, _data.setData)({ error: error });
      }
    }
  }

  return renderMain(data, main);
}

function getControls(data) {
  return _react2.default.createElement(_controls2.default, {
    storybook: _storybook2.default,
    selectedKind: data.selectedKind,
    selectedStory: data.selectedStory,
    onKind: setSelectedKind,
    onStory: setSelectedStory });
}

function getIframe(data) {
  var iframeStyle = {
    width: '100%',
    height: '100%',
    border: '0'
  };

  // We need to send iframe=true and dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  var queryString = 'iframe=true&dataId=' + data.dataId;

  return _react2.default.createElement('iframe', {
    style: iframeStyle,
    src: '/?' + queryString });
}

function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var redBox = _react2.default.createElement(_redboxReact2.default, { error: error });
  var controls = getControls(data);
  var root = _react2.default.createElement(_layout2.default, { controls: controls, content: redBox });
  _reactDom2.default.render(root, rootEl);
}

function renderMain(data, main) {
  // Inside iframe, we simply render the main component.
  if (data.iframeMode) {
    return _reactDom2.default.render(main, rootEl);
  }

  // Inside the main page, we simply render iframe.
  var controls = getControls(data);
  var root = _react2.default.createElement(_layout2.default, { controls: controls, content: getIframe(data) });
  _reactDom2.default.render(root, rootEl);
}

// Event handlers
function setSelectedKind(kind) {
  var data = (0, _data.getData)();
  data.selectedKind = kind;
  data.selectedStory = (0, _keys2.default)(_storybook2.default[kind])[0];
  (0, _data.setData)(data);
}

function setSelectedStory(block) {
  var data = (0, _data.getData)();
  data.selectedStory = block;
  (0, _data.setData)(data);
}