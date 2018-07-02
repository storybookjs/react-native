import React from 'react';
import addons from '@storybook/addons';
import Panel from './components/Panel';

addons.register('storybooks/storybook-addon-knobs', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybooks/storybook-addon-knobs', {
    title: 'Knobs',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Panel channel={channel} api={api} key="knobs-panel" active={active} />,
  });
});
