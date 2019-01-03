import React from 'react';
import addons from '@storybook/addons';
import Panel from './panel';

export function register() {
  addons.register('RNKNOBS', () => {
    const channel = addons.getChannel();
    addons.addPanel('RNKNOBS', {
      title: 'Knobs',
      // eslint-disable-next-line react/prop-types
      render: ({ active, key }) => <Panel key={key} channel={channel} active={active} />,
    });
  });
}
