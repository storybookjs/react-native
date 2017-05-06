/* eslint import/prefer-default-export:0 */

import React from 'react';
import addons from '@storybook/storybook-addons';
import CommentsPanel from './containers/CommentsPanel';
import { ADDON_ID, PANEL_ID } from '../shared';

export function init() {
  addons.register(ADDON_ID, api => {
    // add 'Comments' panel
    addons.addPanel(PANEL_ID, {
      title: 'Comments',
      render: () => <CommentsPanel api={api} />,
    });
  });
}
