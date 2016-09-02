import { EventEmitter } from 'events';

export default function (provider, reduxStore, actions) {
  const callbacks = new EventEmitter();
  let currentKind;
  let currentStory;

  const providerApi = {
    onStory(cb) {
      callbacks.on('story', cb);
      if (currentKind && currentStory) {
        // Using a setTimeout to call the callback to make sure it's
        // not called on current event-loop. When users add callbacks
        // they usually expect it to be called in a future event loop.
        setTimeout(() => cb(currentKind, currentStory), 0);
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

    getQueryParam(key) {
      const { api } = reduxStore.getState();
      if (api.customQueryParams) {
        return api.customQueryParams[key];
      }
      return undefined;
    },
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    const { api } = reduxStore.getState();
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
}
