'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _ = require('./');

var _api = require('../configs/reducers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  setStories: function setStories(_ref, stories) {
    var reduxStore = _ref.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_STORIES,
      stories: stories
    });
  },
  selectStory: function selectStory(_ref2, kind, story) {
    var reduxStore = _ref2.reduxStore;

    reduxStore.dispatch({
      type: _.types.SELECT_STORY,
      kind: kind,
      story: story
    });
  },
  jumpToStory: function jumpToStory(_ref3, direction) {
    var reduxStore = _ref3.reduxStore;

    reduxStore.dispatch({
      type: _.types.JUMP_TO_STORY,
      direction: direction
    });
  },
  setOptions: function setOptions(_ref4, options) {
    var reduxStore = _ref4.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_OPTIONS,
      options: (0, _lodash2.default)(options, (0, _keys2.default)(_api.defaultState.options))
    });
  },
  setQueryParams: function setQueryParams(_ref5, customQueryParams) {
    var reduxStore = _ref5.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_QUERY_PARAMS,
      customQueryParams: customQueryParams
    });
  }
};