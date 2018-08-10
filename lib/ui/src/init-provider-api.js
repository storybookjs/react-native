import { reaction } from 'mobx';
import { EventEmitter } from 'events';
import qs from 'qs';

export default ({ provider, store }) => {
  const onStoryListeners = new EventEmitter();

  const api = {
    onStory(cb) {
      onStoryListeners.on('story', cb);
      if (store.selectedKind && store.selectedStory) {
        // Using a setTimeout to call the callback to make sure it's
        // not called on current event-loop. When users add callbacks
        // they usually expect it to be called in a future event loop.
        setTimeout(() => cb(store.selectedKind, store.selectedStory), 0);
      }

      // removeListener
      return () => onStoryListeners.removeListener('story', cb);
    },
    setStories(stories) {
      store.setStories(stories);
    },
    selectInCurrentKind(story) {
      store.selectInCurrentKind(story);
    },
    selectStory(kind, story) {
      store.selectStory(kind, story);
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
      const url = qs.stringify(
        {
          ...store.urlState,
          ...overrideParams,
        },
        { addQueryPrefix: true }
      );

      return {
        ...store.urlState,
        url,
      };
    },
  };

  provider.handleAPI(api);

  reaction(
    () => ({
      selectedKind: store.selectedKind,
      selectedStory: store.selectedStory,
    }),
    () => {
      if (!store.selectedKind) return;
      onStoryListeners.emit('story', store.selectedKind, store.selectedStory);
    }
  );
};
