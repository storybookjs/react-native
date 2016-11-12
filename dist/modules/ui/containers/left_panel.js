'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapper = undefined;

var _left_panel = require('../components/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

var _filters = require('../libs/filters');

var filters = _interopRequireWildcard(_filters);

var _gen_redux_loader = require('../libs/gen_redux_loader');

var _gen_redux_loader2 = _interopRequireDefault(_gen_redux_loader);

var _compose = require('../../../compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapper = exports.mapper = function mapper(_ref, props, _ref2) {
  var api = _ref.api,
      ui = _ref.ui;
  var actions = _ref2.actions;

  var actionMap = actions();
  var stories = api.stories,
      selectedKind = api.selectedKind,
      selectedStory = api.selectedStory,
      options = api.options;
  var storyFilter = ui.storyFilter;


  var data = {
    stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
    selectedKind: selectedKind,
    selectedStory: selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter: storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name: options.name,
    url: options.url
  };

  return data;
};

exports.default = (0, _compose2.default)((0, _gen_redux_loader2.default)(mapper))(_left_panel2.default);