import React from 'react';
import addons from '@storybook/addons';
import Panel from './components/Panel';
import { ADDON_ID, PANEL_ID } from './shared';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'Knobs',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Panel channel={channel} api={api} key="knobs-panel" active={active} />,
  });
});
