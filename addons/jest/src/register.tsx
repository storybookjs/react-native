import React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from './shared';

import Panel from './components/Panel';

addons.register(ADDON_ID, api => {
  addons.addPanel(PANEL_ID, {
    title: 'tests',
    render: ({ active, key }) => <Panel key={key} api={api} active={active} />,
  });
});
