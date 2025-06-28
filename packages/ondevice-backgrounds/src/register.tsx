import { addons, types } from 'storybook/internal/manager-api';
import BackgroundPanel from './BackgroundPanel';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Backgrounds',
    render: ({ active }) => <BackgroundPanel api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
