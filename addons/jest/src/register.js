/* eslint-disable react/no-danger */
import React from 'react';
import addons from '@storybook/addons';

import TestPanelTitle from './components/TestsPanelTitle';
import TestsPanel from './components/TestsPanel';

// Register the addon with a unique name.
addons.register('storybook/tests', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/tests/panel', {
    title: <TestPanelTitle channel={addons.getChannel()} api={api} />,
    render: () => <TestsPanel channel={addons.getChannel()} api={api} />,
  });
});
