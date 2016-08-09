'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.ensureKind = ensureKind;
exports.ensureStory = ensureStory;
exports.jumpToStory = jumpToStory;

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.types.SELECT_STORY:
      {
        var selectedKind = ensureKind(state.stories, action.kind);
        var selectedStory = ensureStory(state.stories, selectedKind, action.story);
        return (0, _extends3.default)({}, state, {
          selectedKind: selectedKind,
          selectedStory: selectedStory
        });
      }

    case _actions.types.JUMP_TO_STORY:
      {
        var _jumpToStory = jumpToStory(state.stories, state.selectedKind, state.selectedStory, action.direction);

        var _selectedKind = _jumpToStory.selectedKind;
        var _selectedStory = _jumpToStory.selectedStory;

        return (0, _extends3.default)({}, state, {
          selectedKind: _selectedKind,
          selectedStory: _selectedStory
        });
      }

    case _actions.types.SET_STORIES:
      {
        var newState = (0, _extends3.default)({}, state, {
          stories: action.stories
        });

        newState.selectedKind = ensureKind(newState.stories, state.selectedKind);
        newState.selectedStory = ensureStory(newState.stories, newState.selectedKind, state.selectedStory);

        return newState;
      }

    case _actions.types.SET_OPTIONS:
      {
        var newOptions = (0, _extends3.default)({}, state.options, action.options);

        return (0, _extends3.default)({}, state, {
          options: newOptions
        });
      }

    default:
      return state;
  }
};

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensureKind(storyKinds, selectedKind) {
  if (!storyKinds) return selectedKind;

  var found = storyKinds.find(function (item) {
    return item.kind === selectedKind;
  });
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  var kinds = storyKinds.map(function (item) {
    return item.kind;
  });
  return kinds[0];
}

function ensureStory(storyKinds, selectedKind, selectedStory) {
  if (!storyKinds) return selectedStory;

  var kindInfo = storyKinds.find(function (item) {
    return item.kind === selectedKind;
  });
  if (!kindInfo) return null;

  var found = kindInfo.stories.find(function (item) {
    return item === selectedStory;
  });
  if (found) return found;

  return kindInfo.stories[0];
}

function jumpToStory(storyKinds, selectedKind, selectedStory, direction) {
  var flatteredStories = [];
  var currentIndex = -1;

  storyKinds.forEach(function (_ref) {
    var kind = _ref.kind;
    var stories = _ref.stories;

    stories.forEach(function (story) {
      flatteredStories.push({ kind: kind, story: story });
      if (kind === selectedKind && story === selectedStory) {
        currentIndex = flatteredStories.length - 1;
      }
    });
  });

  var jumpedStory = flatteredStories[currentIndex + direction];
  if (!jumpedStory) {
    return { selectedKind: selectedKind, selectedStory: selectedStory };
  }

  return {
    selectedKind: jumpedStory.kind,
    selectedStory: jumpedStory.story
  };
}

var defaultState = {
  actions: [],
  options: {
    name: 'REACT STORYBOOK',
    url: 'https://github.com/kadirahq/react-storybook'
  }
};