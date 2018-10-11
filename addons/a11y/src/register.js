import React from 'react';
import addons, { types } from '@storybook/addons';

import Panel from './components/Panel';
import ColorBlindness from './components/ColorBlindness';

import { ADDON_ID, PANEL_ID } from './shared';

function init() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();

    addons.add(PANEL_ID, {
      type: types.TOOL,
      render: () => <ColorBlindness />,
    });

    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Accessibility',
      // eslint-disable-next-line react/prop-types
      render: ({ active }) => <Panel channel={channel} api={api} active={active} />,
    });
  });
}

export { init };
