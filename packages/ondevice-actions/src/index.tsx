import { ADDON_ID, PANEL_ID, PARAM_KEY } from 'storybook/actions';
import { addons, types } from 'storybook/manager-api';
import ActionLogger from './containers/ActionLogger';
import { actionStore } from './containers/ActionLogger/actionStore';

export function register() {
  addons.register(ADDON_ID, (_api) => {
    // Record actions from the start, not only while the panel is mounted.
    actionStore.listen();

    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Actions',
      render: ({ active }) => <ActionLogger active={active} />,
      paramKey: PARAM_KEY,
    });
  });
}
