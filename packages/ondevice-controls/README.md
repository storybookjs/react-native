# @storybook/addon-ondevice-controls (deprecated)

**Controls are built into `@storybook/react-native` from v11 and are on by default. You don't need this package.**

This package is now an empty compatibility stub. Its `register` registers nothing, so configs that still list it in `deviceAddons` keep working and get the built-in Controls panel, plus a one-time warning in development asking you to remove it. It no longer depends on `@react-native-community/datetimepicker`, `@react-native-community/slider` or `react-native-modal-datetime-picker`.

## Migrating

1. Remove it from `deviceAddons` in `.rnstorybook/main.ts`:

   ```diff
    const main: StorybookConfig = {
      deviceAddons: [
   -    '@storybook/addon-ondevice-controls',
        '@storybook/addon-ondevice-actions',
      ],
    };
   ```

2. Uninstall it:

   ```sh
   npm uninstall @storybook/addon-ondevice-controls
   ```

3. Restart your bundler so `storybook.requires.ts` is regenerated (or run `npx sb-rn-get-stories`).

`@react-native-community/datetimepicker` and `@react-native-community/slider` are now optional. Keep them if you want the native date picker and slider; without them the Controls panel uses JavaScript fallbacks. If nothing else in your app uses `react-native-modal-datetime-picker`, you can uninstall that too.

To turn the built-in Controls panel off, set `features: { ondeviceControls: false }` in `main.ts`.

If you imported `getControlArgTypes` from `@storybook/addon-ondevice-controls/dist/controlArgTypes`, import it from `@storybook/react-native/controls` instead. The old path still re-exports it for now.

See the [Controls guide](https://storybookjs.github.io/react-native/docs/intro/configuration/controls) and the [migration guide](https://github.com/storybookjs/react-native/blob/next/MIGRATION.md#controls-are-built-in).
