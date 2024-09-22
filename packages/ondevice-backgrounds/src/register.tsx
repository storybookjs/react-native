import { addons, types } from '@storybook/core/manager-api';
import BackgroundPanel from './BackgroundPanel';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api) => {
  const channel = addons.getChannel();
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Backgrounds',
    render: ({ active }) => <BackgroundPanel channel={channel} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
