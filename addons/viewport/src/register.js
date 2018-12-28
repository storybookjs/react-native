import React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID } from './constants';

import Tool from './Tool';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.add(ADDON_ID, {
    type: types.TOOL,
    title: 'viewport / media-queries',
    render: () => <Tool channel={channel} api={api} />,
  });
});
