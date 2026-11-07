# Storybook Actions Addon for React Native (deprecated)

> **Deprecated:** The Actions addon is built into `@storybook/react-native` from v11 and is enabled by default. This package is now an empty compatibility stub and you can remove it.

## What this package does now

Importing `@storybook/addon-ondevice-actions/register` (which is what listing it in `deviceAddons` does) registers nothing. The Actions panel comes from `@storybook/react-native`, so you still get exactly one panel. In development it logs a single warning reminding you to remove the package.

## Migrating

1. Remove `'@storybook/addon-ondevice-actions'` from `deviceAddons` in `.rnstorybook/main.ts`:

   ```ts
   // .rnstorybook/main.ts
   import type { StorybookConfig } from '@storybook/react-native';

   const main: StorybookConfig = {
     stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
     deviceAddons: [
       '@storybook/addon-ondevice-controls',
       // '@storybook/addon-ondevice-actions', <- remove
     ],
   };

   export default main;
   ```

2. Uninstall the package:

   ```sh
   npm uninstall @storybook/addon-ondevice-actions
   ```

Your stories don't change: `argTypes: { onPress: { action: 'pressed' } }` and `fn()` from `storybook/test` are logged by the built-in panel.

To turn the built-in panel off, set `features: { ondeviceActions: false }` in `main.ts`. See the [Actions guide](https://storybookjs.github.io/react-native/docs/intro/configuration/actions).
