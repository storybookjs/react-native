'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.storiesOf = storiesOf;
exports.getStories = getStories;
exports.configure = configure;
exports.renderMain = renderMain;

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _data = require('./data');

var _storybook = require('./storybook');

var _storybook2 = _interopRequireDefault(_storybook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function storiesOf(kind, m) {
  // XXX: Add a better way to create stories and mutate them.
  m.hot.dispose(function () {
    delete _storybook2.default[kind];
  });

  _storybook2.default[kind] = {};
  function add(storyName, fn) {
    _storybook2.default[kind][storyName] = fn;
    return { add: add };
  }

  return { add: add };
}

function getStories() {
  return _storybook2.default;
}

function configure(loaders, module) {
  var render = function render() {
    function renderApp() {
      loaders();
      renderMain(getStories());
    }

    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  if (module.hot) {
    module.hot.accept(function () {
      setTimeout(render);
    });
  }

  render();
}

function renderMain(stories) {
  var data = (0, _data.getData)();
  data.error = null;

  data.selectedKind = _storybook2.default[data.selectedKind] ? data.selectedKind : (0, _keys2.default)(_storybook2.default)[0];

  if (data.selectedKind) {
    var _stories = _storybook2.default[data.selectedKind];
    data.selectedStory = _stories[data.selectedStory] ? data.selectedStory : (0, _keys2.default)(_stories)[0];
  }

  (0, _data.setData)(data);
};

var renderError = exports.renderError = function renderError(e) {
  var data = (0, _data.getData)();
  data.error = e;

  (0, _data.setData)(data);
};