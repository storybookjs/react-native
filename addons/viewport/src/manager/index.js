import React from 'react';
import addons, { types } from '@storybook/addons';

import Tool from './components/Tool';
import Panel from './components/Panel';

import { ADDON_ID, PANEL_ID } from '../shared';

const addChannel = api => {
  const channel = addons.getChannel();

  addons.add(PANEL_ID, {
    type: types.TOOL,
    render: () => <Tool channel={channel} api={api} />,
  });

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Viewport',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Panel channel={channel} api={api} active={active} />,
  });
};

const init = () => {
  addons.register(ADDON_ID, addChannel);
};

export { init, addChannel };
