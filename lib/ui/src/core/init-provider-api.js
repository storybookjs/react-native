import qs from 'qs';

import { STORY_CHANGED } from '@storybook/core-events';

export default ({ provider, api, store, eventHandler }) => {
  const providerAPI = {
    on: (type, cb, peer = true) => {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => provider.channel.removeListener(type, cb);
    },
    off: (type, cb) => {
      provider.channel.removeListener(type, cb);
    },
    emit: (type, event) => {
      provider.channel.emit(type, event);
    },

    // TODO deprecate this
    onStory: cb => providerAPI.on(STORY_CHANGED, cb),

    ...api,

    handleShortcut: eventHandler.handle,
    setOptions: options => {
      api.setOptions(options);
      api.setShortcutsOptions(options);
    },
    getQueryParam: key => {
      const { customQueryParams } = store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState: overrideParams => {
      const params = api.getUrlState();
      const url = qs.stringify(
        {
          ...params,
          ...overrideParams,
        },
        { encode: false, addQueryPrefix: true }
      );

      return {
        ...params,
        url,
      };
    },
  };

  provider.handleAPI(providerAPI);
};
