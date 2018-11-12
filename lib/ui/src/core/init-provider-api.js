import qs from 'qs';

import { STORY_RENDERED } from '@storybook/core-events';

export default ({ provider, api, store, eventHandler }) => {
  provider.handleAPI({
    on(type, cb, peer = true) {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => provider.channel.removeListener(type, cb);
    },
    off(type, cb) {
      provider.channel.removeListener(type, cb);
    },
    emit(type, event) {
      provider.channel.emit(type, event);
    },

    // TODO deprecate this
    onStory(cb) {
      return this.on(STORY_RENDERED, cb);
    },

    ...api,

    handleShortcut: eventHandler.handle,
    setOptions(options) {
      api.setOptions(options);
      api.setShortcutsOptions(options);
    },
    setQueryParams: api.setQueryParams,
    getQueryParam(key) {
      const { customQueryParams } = store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState(overrideParams) {
      const url = qs.stringify(
        {
          ...api.getUrlState(),
          ...overrideParams,
        },
        { encode: false, addQueryPrefix: true }
      );

      return {
        ...api.getUrlState(),
        url,
      };
    },
  });
};
