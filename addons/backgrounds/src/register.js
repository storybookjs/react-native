import React from 'react';
import addons from '@storybook/addons';

import BackgroundPanel from './BackgroundPanel';

const ADDON_ID = 'storybook-addon-background';
const PANEL_ID = `${ADDON_ID}/background-panel`;

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'Backgrounds',
    render: () => <BackgroundPanel channel={channel} api={api} />,
  });
});
