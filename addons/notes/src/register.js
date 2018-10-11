import React from 'react';
import addons, { types } from '@storybook/addons';

import Panel from './Panel';
import { ADDON_ID, PANEL_ID } from './shared';

function init() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    // eslint-disable-next-line react/prop-types
    const render = ({ active }) => <Panel channel={channel} api={api} active={active} />;
    const title = 'Notes';

    addons.add(PANEL_ID, {
      type: types.TAB,
      title,
      route: '/info/',
      render,
    });

    addons.add(PANEL_ID, {
      type: types.PANEL,
      title,
      route: '/info/',
      render,
    });
  });
}

export { init };
