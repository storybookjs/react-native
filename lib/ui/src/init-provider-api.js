import { autorun } from 'mobx';

import { EventEmitter } from 'events';

export default ({ provider, store }) => {
  const callbacks = new EventEmitter();
  let currentKind;
  let currentStory;

  const api = {
    onStory(cb) {
      console.log('onStory');
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
    setStories(stories) {
      store.setStories(stories);
    },
    selectInCurrentKind(...args) {
      console.log('selectInCurrentKind', args);
    },
    selectStory(...args) {
      console.log('selectStory', args);
    },
    handleShortcut(event) {
      store.handleEvent(event);
    },
    setQueryParams(...args) {
      console.log('setQueryParams', args);
    },
    setOptions(...args) {
      console.log('setOptions', args);
    },
    getQueryParam(...args) {
      console.log('getQueryParam', args);
    },
    getUrlState(...args) {
      console.log('getUrlState', args);
    }
  };

  provider.handleAPI(api);

  autorun(() => {
    if (!store.selectedKind) return;

    if (
      store.selectedKind === currentKind &&
      store.selectedStory === currentStory
    ) {
      // No change in the selected story so avoid emitting 'story'
      return;
    }

    currentKind = store.selectedKind;
    currentStory = store.selectedStory;
    callbacks.emit('story', store.selectedKind, store.selectedStory);
  });
};
