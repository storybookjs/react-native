import React from 'react';
import { addons, types } from '@storybook/addons';

import { ADDON_ID } from './constants';
import { BackgroundSelector } from './containers/BackgroundSelector';

addons.register(ADDON_ID, api => {
  addons.add(ADDON_ID, {
    title: 'Backgrounds',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <BackgroundSelector api={api} />,
  });
});
