import React from 'react';
import addons from '@storybook/addons';
import Panel from './Panel';

export { withKnobs } from '@storybook/addon-knobs';

export function register() {
  addons.register('RNCONTROLS', () => {
    const channel = addons.getChannel();
    addons.addPanel('RNCONTROLS', {
      title: 'Controls',
      render: ({ active, key }) => <Panel key={key} channel={channel} active={active} />,
      paramKey: 'controls',
    });
  });
}
