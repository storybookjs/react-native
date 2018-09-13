import React from 'react';
import addons from '@storybook/addons';
import ResourcePanel from './ResourcePanel';

addons.register('storybook/resources', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/resources/panel', {
    title: 'Resources',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <ResourcePanel channel={channel} api={api} active={active} />,
  });
});
