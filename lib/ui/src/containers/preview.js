import { inject } from 'mobx-react';
import qs from 'qs';
import { Preview } from '@storybook/components';

export function mapper(store) {
  const { selectedKind, selectedStory } = store;
  const queryString = qs.stringify({
    selectedKind,
    selectedStory,
  });
  const url = `iframe.html?${queryString}`;

  return {
    url,
  };
}

const P = inject(({ store }) => mapper(store))(Preview);

export default P;
