/* eslint-disable react/no-danger */
import React from 'react';
import addons from '@storybook/addons';

import PanelTitle from './components/PanelTitle';
import Panel from './components/Panel';

// Register the addon with a unique name.
addons.register('storybook/tests', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/tests/panel', {
    title: <PanelTitle channel={addons.getChannel()} api={api} />,
    render: () => <Panel channel={addons.getChannel()} api={api} />,
  });
});
