'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;
exports.changeUrl = changeUrl;
exports.updateStore = updateStore;
exports.handleInitialUrl = handleInitialUrl;

exports.default = function (_ref, actions) {
  var reduxStore = _ref.reduxStore;

  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(function () {
    return changeUrl(reduxStore);
  });
  changeUrl(reduxStore);

  // handle initial URL
  handleInitialUrl(actions, window.location);

  // handle back button
  window.onpopstate = function () {
    config.insidePopState = true;
    handleInitialUrl(actions, window.location);
    config.insidePopState = false;
  };
};

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = exports.config = {
  insidePopState: false
};

function changeUrl(reduxStore) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  var _reduxStore$getState = reduxStore.getState();

  var api = _reduxStore$getState.api;

  if (!api) return;

  var selectedKind = api.selectedKind;
  var selectedStory = api.selectedStory;

  var queryString = _qs2.default.stringify({ selectedKind: selectedKind, selectedStory: selectedStory });

  if (queryString === '') return;

  var url = '?' + queryString;
  var state = {
    url: url,
    selectedKind: selectedKind,
    selectedStory: selectedStory
  };

  window.history.pushState(state, '', url);
}

function updateStore(queryParams, actions) {
  var selectedKind = queryParams.selectedKind;
  var selectedStory = queryParams.selectedStory;

  if (selectedKind && selectedStory) {
    actions.api.selectStory(selectedKind, selectedStory);
  }
}

function handleInitialUrl(actions, location) {
  var queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  var parsedQs = _qs2.default.parse(queryString);
  updateStore(parsedQs, actions);
}