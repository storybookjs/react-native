import { EventEmitter } from 'events';

export default function (provider, reduxStore, actions) {
  const callbacks = new EventEmitter();

  const providerApi = {
    onStory(cb) {
      callbacks.on('story', cb);
      return function stopListening() {
        callbacks.removeListener('story', cb);
      };
    },

    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    setOptions: actions.api.setOptions,
    handleShortcut: actions.shortcuts.handleEvent,
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    const { api } = reduxStore.getState();
    if (!api) return;

    callbacks.emit('story', api.selectedKind, api.selectedStory);
    // providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
}
