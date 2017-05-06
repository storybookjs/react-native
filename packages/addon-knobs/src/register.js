import React from 'react';
import addons from '@storybook/storybook-addons';
import Panel from './components/Panel';

addons.register('kadirahq/storybook-addon-knobs', api => {
  const channel = addons.getChannel();

  addons.addPanel('kadirahq/storybook-addon-knobs', {
    title: 'Knobs',
    render: () => <Panel channel={channel} api={api} key="knobs-panel" />,
  });
});
