import React from 'react';

import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from './constants';
import { Panel } from './panel';

addons.register(ADDON_ID, () => {
  addons.add('placeholder', {
    title: 'empty placeholder',
    type: types.PANEL,
    render: ({ active, key }) => (
      <div hidden={!active} key={key}>
        {active}Empty indeed
      </div>
    ),
  });
  addons.add(PANEL_ID, {
    title: 'roundtrip',
    type: types.PANEL,
    render: ({ active, key }) => <Panel key={key} active={active} />,
  });
});
