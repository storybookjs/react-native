'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (provider, reduxStore, actions) {
  var callbacks = new _events.EventEmitter();

  var providerApi = {
    onStory: function onStory(cb) {
      callbacks.on('story', cb);
      return function stopListening() {
        callbacks.removeListener('story', cb);
      };
    },


    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    setOptions: actions.api.setOptions,
    handleShortcut: actions.shortcuts.handleEvent
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    var _reduxStore$getState = reduxStore.getState();

    var api = _reduxStore$getState.api;

    if (!api) return;

    callbacks.emit('story', api.selectedKind, api.selectedStory);
    // providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
};

var _events = require('events');