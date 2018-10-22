import { reaction } from 'mobx';
import { EventEmitter } from 'events';
import qs from 'qs';

import { STORY_RENDERED } from '@storybook/core-events';

export default ({ provider, stores, eventHandler }) => {
  const onStoryListeners = new EventEmitter();
  const { store } = stores;

  const api = {
    on(type, cb, peer = true) {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => api.off(type, cb);
    },
    off(type, cb) {
      provider.channel.off(type, cb);
    },
    emit(type, event) {
      provider.channel.emit(type, event);
    },

    // TODO deprecate this
    onStory(cb) {
      return this.on(STORY_RENDERED, cb);
    },
    setStories: store.setStories.bind(store),
    selectInCurrentKind: store.selectInCurrentKind.bind(store),
    selectStory: store.selectStory.bind(store),
    handleShortcut: eventHandler.handle.bind(store),
    setOptions(options) {
      store.setOptions(options);
      store.setShortcutsOptions(options);
    },
    setQueryParams: store.setQueryParams.bind(store),
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
        { encode: false, addQueryPrefix: true }
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
