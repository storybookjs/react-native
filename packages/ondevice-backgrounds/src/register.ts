/**
 * Backgrounds are built into `@storybook/react-native`, so this registers nothing. The built-in
 * Backgrounds panel stays enabled unless `features.ondeviceBackgrounds` is `false`.
 */

declare const __DEV__: boolean | undefined;

const WARNED_KEY = '__STORYBOOK_ADDON_ONDEVICE_BACKGROUNDS_DEPRECATION_WARNED__';

const g = globalThis as typeof globalThis & { [WARNED_KEY]?: boolean };

if (typeof __DEV__ !== 'undefined' && __DEV__ && !g[WARNED_KEY]) {
  g[WARNED_KEY] = true;
  console.warn(
    '[@storybook/addon-ondevice-backgrounds] Backgrounds are now built into @storybook/react-native. ' +
      'Remove "@storybook/addon-ondevice-backgrounds" from deviceAddons in .rnstorybook/main and uninstall the package.'
  );
}

export {};
