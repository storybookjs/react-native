import { ADDON_ID, PARAM_KEY } from '@storybook/react-native/controls';

export { ADDON_ID, PARAM_KEY };

declare const __DEV__: boolean | undefined;

let warned = false;

/**
 * Controls are built into `@storybook/react-native` and registered by default, so this registers
 * nothing. It's kept so configs that still list this package in `deviceAddons` keep working.
 */
export function register() {
  if (typeof __DEV__ !== 'undefined' && __DEV__ && !warned) {
    warned = true;
    console.warn(
      '[storybook] @storybook/addon-ondevice-controls is no longer needed: the Controls addon is ' +
        "built into @storybook/react-native. Remove it from 'deviceAddons' in .rnstorybook/main " +
        'and uninstall it.'
    );
  }
}
