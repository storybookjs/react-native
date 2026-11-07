import { ADDON_ID, PANEL_ID, PARAM_KEY } from 'storybook/actions';
import { addons, types } from 'storybook/manager-api';
import ActionLogger from './containers/ActionLogger';
import { actionStore } from './containers/ActionLogger/actionStore';

/**
 * Registers the built-in Actions panel. Uses the same addon id as
 * `@storybook/addon-ondevice-actions`, so if that package is still listed in `deviceAddons` this
 * registration (which runs later, from `start()`) replaces it rather than adding a second panel.
 */
export function registerActionsAddon() {
  if (__DEV__ && addons.experimental_getRegisteredAddons().includes(ADDON_ID)) {
    console.warn(
      `[storybook] features.ondeviceActions is enabled, so the built-in Actions panel is used and ` +
        `@storybook/addon-ondevice-actions is ignored. Remove it from deviceAddons in your main config.`
    );
  }

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
