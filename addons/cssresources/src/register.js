import React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './constants';

import CssResourcePanel from './css-resource-panel';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'CSS resources',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <CssResourcePanel channel={channel} api={api} active={active} />,
  });
});
