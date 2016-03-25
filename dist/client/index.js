'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.storiesOf = storiesOf;
exports.action = action;
exports.configure = configure;
exports.renderMain = renderMain;
exports.getStorybookData = getStorybookData;

var _data = require('./data');

var _storybook2 = require('./storybook');

var _storybook3 = _interopRequireDefault(_storybook2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function storiesOf(kind, m) {
  // XXX: Add a better way to create stories and mutate them.
  m.hot.dispose(function () {
    delete _storybook3.default[kind];
  });

  _storybook3.default[kind] = {};
  function add(storyName, fn) {
    _storybook3.default[kind][storyName] = fn;
    return { add: add };
  }

  return { add: add };
}

function action(name) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _getData = (0, _data.getData)();

    var _getData$actions = _getData.actions;
    var actions = _getData$actions === undefined ? [] : _getData$actions;

    // Remove events from the args. Otherwise, it creates a huge JSON string.

    if (args[0] && args[0].constructor && /Synthetic/.test(args[0].constructor.name)) {
      args[0] = '[' + args[0].constructor.name + ']';
    }

    actions = [{ name: name, args: args }].concat(actions.slice(0, 5));
    (0, _data.setData)({ actions: actions });
  };
}

function configure(loaders, module) {
  var render = function render() {
    function renderApp() {
      loaders();
      renderMain();
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

function renderMain() {
  var data = (0, _data.getData)();
  data.error = null;
  data.__updatedAt = Date.now();
  data.storybook = getStorybookData();

  if (!data.selectedKind || !_storybook3.default[data.selectedKind]) {
    data.selectedKind = (0, _keys2.default)(_storybook3.default)[0];
  }

  var stories = _storybook3.default[data.selectedKind];
  if (stories) {
    if (!data.selectedStory || !stories[data.selectedStory]) {
      data.selectedStory = (0, _keys2.default)(stories)[0];
    }
  }

  (0, _data.setData)(data);
};

var renderError = exports.renderError = function renderError(e) {
  var data = (0, _data.getData)();
  var stack = e.stack;
  var message = e.message;

  data.error = { stack: stack, message: message };

  (0, _data.setData)(data);
};

function getStorybookData() {
  var _storybook = {};
  (0, _keys2.default)(_storybook3.default).forEach(function (kind) {
    var stories = _storybook3.default[kind];
    _storybook[kind] = (0, _keys2.default)(stories);
  });

  return _storybook;
}