import { addons, types } from '@storybook/addons';

import GQL from './manager';
import { ADDON_ID } from '.';

export function register() {
  addons.register(ADDON_ID, () => {
    addons.add(ADDON_ID, {
      title: 'GraphiQL',
      type: types.TAB,
      route: ({ storyId }) => `/graphql/${storyId}`,
      match: ({ viewMode }) => viewMode === 'graphql',
      render: GQL,
    });
  });
}
