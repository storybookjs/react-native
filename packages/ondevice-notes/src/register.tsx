import { addons, types } from '@storybook/manager-api';
import { Notes } from './components/Notes';

export const PARAM_KEY = 'notes';

addons.register('storybook/notes', (api) => {
  const channel = addons.getChannel();
  addons.add('storybook/notes/panel', {
    type: types.PANEL,
    title: 'Notes',
    render: ({ active }) => <Notes channel={channel} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
