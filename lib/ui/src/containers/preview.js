import { inject } from 'mobx-react';
import { Preview } from '@storybook/components';

export function mapper(store) {
  return {
    channel: store.channel,
    panels: store.mains,
  };
}

export default inject(({ store }) => mapper(store))(Preview);
