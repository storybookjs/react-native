import React from 'react';
import addons from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './constants';
import BackgroundPanel from './BackgroundPanel';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'Backgrounds',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <BackgroundPanel channel={channel} api={api} active={active} />,
  });
});
