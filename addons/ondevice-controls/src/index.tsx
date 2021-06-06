import React from 'react';
import addons from '@storybook/addons';
import { AddonPanel } from './Panel';
import ControlsPanel from './ControlsPanel';

export const ADDON_ID = 'RNCONTROLS' as const;
export const PARAM_KEY = 'controls' as const;

export function register() {
  addons.register(ADDON_ID, () => {
    addons.addPanel(ADDON_ID, {
      title: 'Controls',
      render: ({ active, key }) => (
        <AddonPanel key={key} active={active}>
          <ControlsPanel />
        </AddonPanel>
      ),
      paramKey: PARAM_KEY,
    });
  });
}
