import React from 'react';
import addons from '@storybook/addons';

import Panel from './components/Panel';
import { ADDON_ID, PANEL_ID } from './constants';

export function register() {
  addons.register(ADDON_ID, api => {
    addons.addPanel(PANEL_ID, {
      title: 'Events',
      // eslint-disable-next-line react/prop-types
      render: ({ active, key }) => <Panel key={key} api={api} active={active} />,
    });
  });
}
