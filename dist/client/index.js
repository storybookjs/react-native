'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.storiesOf = storiesOf;
exports.getStories = getStories;
exports.renderMain = renderMain;

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _data = require('./data');

var _papers = require('./papers');

var _papers2 = _interopRequireDefault(_papers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function storiesOf(component, m) {
  // XXX: Add a better way to create paper and mutate them.
  m.hot.dispose(function () {
    delete _papers2.default[component];
  });

  _papers2.default[component] = {};
  function add(storyName, fn) {
    _papers2.default[component][storyName] = fn;
    return { add: add };
  }

  return { add: add };
}

function getStories() {
  return _papers2.default;
}

function renderMain(papers) {
  var data = (0, _data.getData)();
  data.error = null;

  data.selectedPaper = _papers2.default[data.selectedPaper] ? data.selectedPaper : (0, _keys2.default)(_papers2.default)[0];

  if (data.selectedPaper) {
    var story = _papers2.default[data.selectedPaper];
    data.selectedBlock = story[data.selectedBlock] ? data.selectedBlock : (0, _keys2.default)(story)[0];
  }

  (0, _data.setData)(data);
};

var renderError = exports.renderError = function renderError(e) {
  var data = (0, _data.getData)();
  data.error = e;

  (0, _data.setData)(data);
};