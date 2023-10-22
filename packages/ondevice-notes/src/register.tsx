import * as React from 'react';
import addons from '@storybook/addons';
import { Notes } from './components/Notes';

export const PARAM_KEY = 'notes';

addons.register('storybook/notes', (api) => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    render: ({ active, key }) => <Notes key={key} channel={channel} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
