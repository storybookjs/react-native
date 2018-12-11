import * as React from 'react';
import addons, { types } from '@storybook/addons';
import Panel from './Panel'; // todo fix eslint in tslint (igor said he fixed it, should ask him)
import { ADDON_ID, PANEL_ID } from './shared';

// todo add api types
addons.register(ADDON_ID, (api: any) => {
  const channel = addons.getChannel();
  const render = ({ active }: { active: boolean }) => <Panel channel={channel} api={api} active={active}/>;
  const title = 'Notes';

  addons.add(PANEL_ID, {
    type: types.TAB,
    title,
    route: ({ componentId }: { componentId: any }) => `/info/${componentId}`, // todo add type
    match: ({ viewMode }: { viewMode: any }) => viewMode === 'info', // todo add type
    render
  });
});
