import React from 'react';
import { addons, types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './constants';
import { CssResourcePanel } from './css-resource-panel';

addons.register(ADDON_ID, api => {
  // Need to cast as any as it's not matching Addon type, to investigate
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'CSS resources',
    render: ({ active }) => <CssResourcePanel key={PANEL_ID} api={api} active={active} />,
  });
});
