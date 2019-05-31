import React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from '@storybook/addon-actions';
import ActionLogger from './containers/ActionLogger';

export function register() {
  addons.register(ADDON_ID, () => {
    addons.addPanel(PANEL_ID, {
      title: 'Actions',
      render: ({ active, key }) => <ActionLogger key={key} active={active} />,
      paramKey: PARAM_KEY,
    });
  });
}
