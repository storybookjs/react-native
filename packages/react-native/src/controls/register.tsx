import { addons, types } from 'storybook/manager-api';

import ControlsPanel from './ControlsPanel';
import { AddonPanel } from './Panel';

// Same id as `@storybook/addon-ondevice-controls`. The addon store keys loaders and panels by id, so
// when the package is also listed in `deviceAddons` the built-in registration replaces it instead
// of adding a second Controls panel.
export const ADDON_ID = 'RNCONTROLS' as const;
export const PARAM_KEY = 'controls' as const;

export function registerControlsAddon() {
  // `loaders` is private in the types but a plain object on the addon store.
  const store = addons as unknown as { loaders?: Record<string, unknown> };

  if (store.loaders?.[ADDON_ID]) {
    if (__DEV__) {
      console.warn(
        '[storybook] features.ondeviceControls is enabled, so the built-in Controls panel replaces ' +
          "@storybook/addon-ondevice-controls. You can remove it from 'deviceAddons' in .rnstorybook/main."
      );
    }
    // Replace the package's loader without tripping the addon store's "loaded twice" warning.
    delete store.loaders[ADDON_ID];
  }

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
