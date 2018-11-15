import React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './constants';
import Tool from './Tool';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();

  addons.add(PANEL_ID, {
    type: types.TOOL,
    render: () => <Tool channel={channel} api={api} />,
  });
});
