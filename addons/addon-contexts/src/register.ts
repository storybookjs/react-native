import { createElement as h } from 'react';
import addons, { types } from '@storybook/addons';
import { AddonManager } from './containers/AddonManager';
import { ID } from './libs/constants';

addons.register(ID, (api) =>
  addons.add(ID, {
    title: ID,
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => h(AddonManager, { channel: api.getChannel() }),
  })
);
