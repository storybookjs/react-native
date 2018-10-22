import { EventEmitter } from 'events';
import qs from 'qs';

import { STORY_RENDERED } from '@storybook/core-events';

export default ({ provider, manager, eventHandler }) => {
  const onStoryListeners = new EventEmitter();

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
    setStories: manager.setStories,
    selectInCurrentKind: manager.selectInCurrentKind,
    selectStory: manager.selectStory,
    handleShortcut: eventHandler.handle,
    setOptions(options) {
      manager.setOptions(options);
      manager.setShortcutsOptions(options);
    },
    setQueryParams: manager.setQueryParams,
    getQueryParam(key) {
      const { customQueryParams } = manager.store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState(overrideParams) {
      const url = qs.stringify(
        {
          ...manager.getUrlState(),
          ...overrideParams,
        },
        { encode: false, addQueryPrefix: true }
      );

      return {
        ...manager.getUrlState(),
        url,
      };
    },
  };

  provider.handleAPI(api);

  let prevStory;
  let prevKind;

  manager.store.subscribe(() => {
    const { selectedKind, selectedStory } = manager.store.getState();
    if (!selectedKind) return;

    if (selectedKind !== prevKind || selectedStory !== prevStory) {
      onStoryListeners.emit('story', selectedKind, selectedStory);
    }

    prevStory = selectedStory;
    prevKind = selectedKind;
  });
};
