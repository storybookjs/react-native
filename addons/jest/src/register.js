import React from 'react';
import addons from '@storybook/addons';

import PanelTitle from './components/PanelTitle';
import Panel from './components/Panel';

addons.register('storybook/tests', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/tests/panel', {
    // eslint-disable-next-line react/prop-types
    title: () => <PanelTitle channel={addons.getChannel()} api={api} />,
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Panel channel={channel} api={api} active={active} />,
  });
});
