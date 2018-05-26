import React from 'react';
import addons from '@storybook/addons';

import Panel from './components/Panel';
import { ADDON_ID, PANEL_ID } from './constants';

export function register() {
  addons.register(ADDON_ID, () => {
    addons.addPanel(PANEL_ID, {
      title: 'Events',
      render: () => <Panel channel={addons.getChannel()} />,
    });
  });
}
