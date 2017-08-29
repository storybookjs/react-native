import React from 'react';
import addons from '@storybook/addons';

import { Panel } from './components/Panel';

const ADDON_ID = 'storybook-addon-viewport';
const PANEL_ID = `${ADDON_ID}/addon-panel`;

function addChannel(api) {
  const channel = addons.getChannel();

  addons.addPanel(PANEL_ID, {
    title: 'Viewport',
    render() {
      return <Panel channel={channel} api={api} />;
    },
  });
}

function init() {
  addons.register(ADDON_ID, addChannel);
}

export { init, addChannel };
