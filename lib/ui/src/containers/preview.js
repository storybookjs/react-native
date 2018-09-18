import { inject } from 'mobx-react';
import { Preview } from '@storybook/components';

export function mapper({ store, uiStore }) {
  return {
    channel: store.channel,
    panels: store.mains,
    actions: {
      toggleFullscreen: () => uiStore.toggleFullscreen(),
    },
  };
}

export default inject(({ store, uiStore }) => mapper({ store, uiStore }))(Preview);
