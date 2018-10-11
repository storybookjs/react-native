import { inject } from 'mobx-react';
import { Preview } from '@storybook/components';

export function mapper({ store, uiStore }) {
  return {
    channel: store.channel,
    getElements: store.getElements,
    actions: {
      toggleFullscreen: () => uiStore.toggleFullscreen(),
    },
    options: {
      ...uiStore,
    },
  };
}

export default inject(({ store, uiStore }) => mapper({ store, uiStore }))(Preview);
