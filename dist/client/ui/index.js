'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = renderUI;
exports.getControls = getControls;
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

  var paper = data.papers[data.selectedPaper];
  if (paper) {
    var block = data.papers[data.selectedPaper][data.selectedBlock];
    if (block) {
      try {
        main = block();
      } catch (error) {
        return (0, _data.setData)({ error: error });
      }
    }
  }

  return renderMain(data, main);
}

function getControls(data) {
  return _react2.default.createElement(_controls2.default, {
    papers: data.papers,
    selectedPaper: data.selectedPaper,
    selectedBlock: data.selectedBlock,
    onPaper: setSelectedPaper,
    onBlock: setSelectedBlock });
}

function renderError(data, error) {
  var controls = getControls(data);
  var redBox = _react2.default.createElement(_redboxReact2.default, { error: error });
  var root = _react2.default.createElement(_layout2.default, { controls: controls, content: redBox });
  _reactDom2.default.render(root, rootEl);
}

function renderMain(data, main) {
  var controls = getControls(data);
  var root = _react2.default.createElement(_layout2.default, { controls: controls, content: main });
  _reactDom2.default.render(root, rootEl);
}

// Event handlers
function setSelectedPaper(paper) {
  var data = (0, _data.getData)();
  data.selectedPaper = paper;
  data.selectedBlock = (0, _keys2.default)(data.papers[paper])[0];
  (0, _data.setData)(data);
}

function setSelectedBlock(block) {
  var data = (0, _data.getData)();
  data.selectedBlock = block;
  (0, _data.setData)(data);
}