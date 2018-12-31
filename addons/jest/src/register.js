import React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from './shared';

// import PanelTitle from './components/PanelTitle';
import Panel from './components/Panel';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();

  addons.addPanel(PANEL_ID, {
    title: 'tests',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) => <Panel key={key} channel={channel} api={api} active={active} />,
  });
});
