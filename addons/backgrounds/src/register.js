import React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './constants';
import Panel from './Panel';
import Tool from './Tool';

function init() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();

    addons.add(PANEL_ID, {
      type: types.TOOL,
      render: () => <Tool channel={channel} api={api} />,
    });

    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Backgrounds',
      // eslint-disable-next-line react/prop-types
      render: ({ active }) => <Panel channel={channel} api={api} active={active} />,
    });
  });
}

export { init };
