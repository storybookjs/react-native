import * as React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID, API } from './shared';

// TODO: fix eslint in tslint (igor said he fixed it, should ask him)
import Panel from './Panel';

addons.register(ADDON_ID, (api: API) => {
  const channel = addons.getChannel();
  const render = ({ active }: { active: boolean }) => <Panel api={api} active={active} />;
  const title = 'Notes';

  addons.add(PANEL_ID, {
    type: types.TAB,
    title,
    route: ({ storyId }: { storyId: String }) => `/info/${storyId}`, // todo add type
    match: ({ viewMode }: { viewMode: any }) => viewMode === 'info', // todo add type
    render,
  });
});
