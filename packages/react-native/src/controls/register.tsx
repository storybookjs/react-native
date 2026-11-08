import { addons, types } from 'storybook/manager-api';

import ControlsPanel from './ControlsPanel';
import { AddonPanel } from './Panel';
import { ADDON_ID, PARAM_KEY } from './constants';

export { ADDON_ID, PARAM_KEY };

export function registerControlsAddon() {
  addons.register(ADDON_ID, (api) => {
    addons.add(ADDON_ID, {
      type: types.PANEL,
      title: 'Controls',
      render: ({ active }) => (
        <AddonPanel active={active}>
          <ControlsPanel api={api} />
        </AddonPanel>
      ),
      paramKey: PARAM_KEY,
    });
  });
}
