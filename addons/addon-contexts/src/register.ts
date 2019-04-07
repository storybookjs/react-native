import { createElement as h } from 'react';
import addons, { types } from '@storybook/addons';
import { AddonManager } from './manager/AddonManager';
import { ID } from './constants';

addons.register(ID, (api) =>
  addons.add(ID, {
    title: ID,
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => h(AddonManager, { channel: api.getChannel() }),
  })
);
