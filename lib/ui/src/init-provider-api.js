import { autorun } from 'mobx';
import { EventEmitter } from 'events';

import { getUrlState } from './modules/ui/configs/handle_routing';

export default ({ provider, store }) => {
  const callbacks = new EventEmitter();
  let currentKind;
  let currentStory;

  const api = {
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
    setStories(stories) {
      store.setStories(stories);
    },
    selectInCurrentKind(story) {
      store.selectInCurrentKind(story);
    },
    selectStory(kind, story) {
      store.selectedStory(kind, story);
    },
    handleShortcut(event) {
      store.handleEvent(event);
    },
    setOptions(options) {
      store.setOptions(options);
      store.setShortcutsOptions(options);
    },
    setQueryParams(customQueryParams) {
      store.setQueryParams(customQueryParams);
    },
    getQueryParam(key) {
      if (store.customQueryParams) {
        return store.customQueryParams[key];
      }
      return undefined;
    },
    getUrlState(overrideParams) {
      return getUrlState({ ...store, ...overrideParams });
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
