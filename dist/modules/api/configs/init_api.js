'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (provider, reduxStore, actions) {
  var callbacks = new _events.EventEmitter();
  var currentKind = void 0;
  var currentStory = void 0;

  var providerApi = {
    onStory: function onStory(cb) {
      callbacks.on('story', cb);
      if (currentKind && currentStory) {
        // Using a setTimeout to call the callback to make sure it's
        // not called on current event-loop. When users add callbacks
        // they usually expect it to be called in a future event loop.
        setTimeout(function () {
          return cb(currentKind, currentStory);
        }, 0);
      }
      return function stopListening() {
        callbacks.removeListener('story', cb);
      };
    },


    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    setOptions: actions.api.setOptions,
    handleShortcut: actions.shortcuts.handleEvent,
    setQueryParams: actions.api.setQueryParams,

    getQueryParam: function getQueryParam(key) {
      var _reduxStore$getState = reduxStore.getState();

      var api = _reduxStore$getState.api;

      if (api.customQueryParams) {
        return api.customQueryParams[key];
      }
      return undefined;
    }
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    var _reduxStore$getState2 = reduxStore.getState();

    var api = _reduxStore$getState2.api;

    if (!api) return;

    if (api.selectedKind === currentKind && api.selectedStory === currentStory) {
      // No change in the selected story so avoid emitting 'story'
      return;
    }

    currentKind = api.selectedKind;
    currentStory = api.selectedStory;
    callbacks.emit('story', api.selectedKind, api.selectedStory);
    // providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
};

var _events = require('events');