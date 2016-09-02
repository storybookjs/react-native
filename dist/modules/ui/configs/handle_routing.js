'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.changeUrl = changeUrl;
exports.updateStore = updateStore;
exports.handleInitialUrl = handleInitialUrl;

exports.default = function (_ref, actions) {
  var reduxStore = _ref.reduxStore;

  // handle initial URL
  handleInitialUrl(actions, window.location);

  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(function () {
    return changeUrl(reduxStore);
  });
  changeUrl(reduxStore);

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
  var shortcuts = _reduxStore$getState.shortcuts;
  var ui = _reduxStore$getState.ui;

  if (!api) return;

  var selectedKind = api.selectedKind;
  var selectedStory = api.selectedStory;
  var customQueryParams = api.customQueryParams;
  var full = shortcuts.goFullScreen;
  var down = shortcuts.showDownPanel;
  var left = shortcuts.showLeftPanel;
  var panelRight = shortcuts.downPanelInRight;
  var downPanel = ui.selectedDownPanel;


  var urlObj = (0, _extends3.default)({}, customQueryParams, {
    selectedKind: selectedKind,
    selectedStory: selectedStory,
    full: Number(full),
    down: Number(down),
    left: Number(left),
    panelRight: Number(panelRight),
    downPanel: downPanel
  });

  var url = '?' + _qs2.default.stringify(urlObj);

  var state = (0, _extends3.default)({}, urlObj, {
    full: full,
    down: down,
    left: left,
    panelRight: panelRight,
    url: url
  });

  window.history.pushState(state, '', url);
}

function updateStore(queryParams, actions) {
  var selectedKind = queryParams.selectedKind;
  var selectedStory = queryParams.selectedStory;
  var _queryParams$full = queryParams.full;
  var full = _queryParams$full === undefined ? 0 : _queryParams$full;
  var _queryParams$down = queryParams.down;
  var down = _queryParams$down === undefined ? 1 : _queryParams$down;
  var _queryParams$left = queryParams.left;
  var left = _queryParams$left === undefined ? 1 : _queryParams$left;
  var _queryParams$panelRig = queryParams.panelRight;
  var panelRight = _queryParams$panelRig === undefined ? 0 : _queryParams$panelRig;
  var downPanel = queryParams.downPanel;
  var customQueryParams = (0, _objectWithoutProperties3.default)(queryParams, ['selectedKind', 'selectedStory', 'full', 'down', 'left', 'panelRight', 'downPanel']);


  if (selectedKind && selectedStory) {
    actions.api.selectStory(selectedKind, selectedStory);
  }

  actions.shortcuts.setLayout({
    goFullScreen: Boolean(Number(full)),
    showDownPanel: Boolean(Number(down)),
    showLeftPanel: Boolean(Number(left)),
    downPanelInRight: Boolean(Number(panelRight))
  });

  if (downPanel) {
    actions.ui.selectDownPanel(downPanel);
  }
  actions.api.setQueryParams(customQueryParams);
}

function handleInitialUrl(actions, location) {
  var queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  var parsedQs = _qs2.default.parse(queryString);
  updateStore(parsedQs, actions);
}