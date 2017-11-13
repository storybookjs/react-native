import React from 'react';
import addons from '@storybook/addons';

import Panel from './components/Panel';
import { ADDON_ID, PANEL_ID } from './shared';

function init() {
  addons.register(ADDON_ID, () => {
    addons.addPanel(PANEL_ID, {
      title: 'Accessibility',
      render() {
        return <Panel />;
      },
    });
  });
}

export { init };
