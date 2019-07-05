import React from 'react';
import addons from '@storybook/addons';
import ActionLogger from './containers/ActionLogger';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

export function register() {
  addons.register(ADDON_ID, api => {
    addons.addPanel(PANEL_ID, {
      title: 'Actions',
      render: ({ active, key }) => <ActionLogger key={key} api={api} active={active} />,
      paramKey: PARAM_KEY,
    });
  });
}
