'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = renderError;
exports.renderMain = renderMain;
exports.default = renderPreview;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');

function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var realError = new Error(error.message);
  realError.stack = error.stack;
  var redBox = _react2.default.createElement(_redboxReact2.default, { error: realError });
  _reactDom2.default.render(redBox, rootEl);
}

function renderMain(data) {
  var NoPreview = function NoPreview() {
    return _react2.default.createElement(
      'p',
      null,
      'No Preview Available!'
    );
  };
  var noPreview = _react2.default.createElement(NoPreview, null);
  var selectedKind = data.selectedKind;
  var selectedStory = data.selectedStory;


  var story = (0, _.getStoryStore)().getStory(selectedKind, selectedStory);
  if (!story) {
    return _reactDom2.default.render(noPreview, rootEl);
  }

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recrease instances for every story run.
  // This could leads to issues like below:
  //    https://github.com/kadirahq/react-storybook/issues/81
  _reactDom2.default.unmountComponentAtNode(rootEl);

  return _reactDom2.default.render(story(), rootEl);
}

function renderPreview(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  return renderMain(data);
}