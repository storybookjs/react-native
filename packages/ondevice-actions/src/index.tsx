import { ADDON_ID, PANEL_ID, PARAM_KEY } from '@storybook/addon-actions';
import { addons, types } from '@storybook/manager-api';
import ActionLogger from './containers/ActionLogger';

export function register() {
  addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Actions',
      render: ({ active }) => <ActionLogger active={active} />,
      paramKey: PARAM_KEY,
    });
  });
}
