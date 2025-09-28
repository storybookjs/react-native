import { ADDON_ID, PANEL_ID, PARAM_KEY } from 'storybook/actions';
import { addons, types } from 'storybook/internal/manager-api';
import ActionLogger from './containers/ActionLogger';

addons.register(ADDON_ID, (_api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Actions',
    render: ({ active }) => <ActionLogger active={active} />,
    paramKey: PARAM_KEY,
  });
});
