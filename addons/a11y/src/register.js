import React from 'react';
import addons from '@kadira/storybook-addons';

import Panel from './components/Panel';
import { ADDON_ID, PANEL_ID } from './shared';

function init() {
  addons.register(ADDON_ID, api => {
    addons.addPanel(PANEL_ID, {
      title: 'Accessibility',
      render() {
        return <Panel />;
      }
    });
  });
}

export { init }
