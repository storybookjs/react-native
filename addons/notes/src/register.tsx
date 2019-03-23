import * as React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID } from './shared';

// TODO: fix eslint in tslint (igor said he fixed it, should ask him)
import Panel from './Panel';

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.TAB,
    title: 'Notes',
    route: ({ storyId }) => `/info/${storyId}`, // todo add type
    match: ({ viewMode }) => viewMode === 'info', // todo add type
    render: ({ active }) => <Panel api={api} active={active} />,
  });
});
