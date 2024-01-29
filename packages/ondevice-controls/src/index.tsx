import { addons, types } from '@storybook/manager-api';

import ControlsPanel from './ControlsPanel';
import { AddonPanel } from './Panel';

export const ADDON_ID = 'RNCONTROLS' as const;
export const PARAM_KEY = 'controls' as const;

export function register() {
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
