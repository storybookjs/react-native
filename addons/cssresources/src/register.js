import React from 'react';
import addons from '@storybook/addons';
import CssResourcePanel from './CssResourcePanel';

addons.register('storybook/cssresources', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/cssresources/panel', {
    title: 'Cssresources',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <CssResourcePanel channel={channel} api={api} active={active} />,
  });
});
