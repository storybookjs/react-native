import React from 'react';
import addons from '@storybook/addons';

import { Panel } from './components/Panel';

import { ADDON_ID, PANEL_ID } from '../shared';

const addChannel = api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'Viewport',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Panel channel={channel} api={api} active={active} />,
  });
};

const init = () => {
  addons.register(ADDON_ID, addChannel);
};

export { init, addChannel };
