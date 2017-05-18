import React from 'react';
import addons from '@storybook/addons';
import ActionLogger from './containers/ActionLogger';
import { PANEL_ID } from './';

export function register() {
  addons.register(() => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'Action Logger',
      render: () => <ActionLogger channel={channel} />,
    });
  });
}
