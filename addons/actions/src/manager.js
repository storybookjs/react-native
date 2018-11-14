import React from 'react';
import addons from '@storybook/addons';
import ActionLogger from './containers/ActionLogger';
import { ADDON_ID, PANEL_ID } from '.';

export function register() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'Action Logger',
      // eslint-disable-next-line react/prop-types
      render: ({ active }) => <ActionLogger channel={channel} api={api} active={active} />,
    });
  });
}
