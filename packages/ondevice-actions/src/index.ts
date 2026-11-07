// Provided by React Native at runtime; this package has no react-native or DOM types.
declare const __DEV__: boolean | undefined;
declare const console: { warn(...data: unknown[]): void };

let warned = false;

/**
 * @deprecated The Actions addon is built into `@storybook/react-native`. This is a no-op kept so
 * existing `deviceAddons` entries keep working; remove `@storybook/addon-ondevice-actions` from
 * `deviceAddons` and uninstall it.
 */
export function register() {
  if (typeof __DEV__ !== 'undefined' && __DEV__ && !warned) {
    warned = true;
    console.warn(
      '[storybook] @storybook/addon-ondevice-actions is deprecated: the Actions addon is now built ' +
        'into @storybook/react-native. Remove "@storybook/addon-ondevice-actions" from deviceAddons ' +
        'in .rnstorybook/main.ts and uninstall the package.'
    );
  }
}
