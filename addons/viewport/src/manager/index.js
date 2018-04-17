import React from 'react';
import addons from '@storybook/addons';

import { Panel } from './components/Panel';

import { ADDON_ID, PANEL_ID } from '../shared';

const addChannel = api => {
  const channel = addons.getChannel();

  addons.addPanel(PANEL_ID, {
    title: 'Viewport',
    render() {
      return <Panel channel={channel} api={api} />;
    },
  });
};

const init = () => {
  addons.register(ADDON_ID, addChannel);
};

export { init, addChannel };
