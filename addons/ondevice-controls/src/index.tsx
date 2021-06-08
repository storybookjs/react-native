import React from 'react';
import addons, { types } from '@storybook/addons';

import ControlsPanel from './ControlsPanel';

export const ADDON_ID = 'RNCONTROLS' as const;
export const PARAM_KEY = 'controls' as const;

export function register() {
  addons.register(ADDON_ID, (api) => {
    const channel = addons.getChannel();
    addons.addPanel(ADDON_ID, {
      type: types.PANEL,
      title: 'Controls',
      render: ({ active, key }) => (
        <ControlsPanel channel={channel} api={api} key={key} active={active} />
      ),
      paramKey: PARAM_KEY,
    });
  });
}
