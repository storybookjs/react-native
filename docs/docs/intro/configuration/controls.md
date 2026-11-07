---
sidebar_position: 8
---

# Controls

From v11 the Controls panel is built into `@storybook/react-native` and **on by default**. It has the same control types, `argTypes` and `parameters.controls` options as the old [`@storybook/addon-ondevice-controls`](../addons/controls.md) package, but there's nothing to install and nothing to add to `deviceAddons`.

## Turning it off

Set the `ondeviceControls` [feature flag](./feature-flags.md) to `false` in `main.ts`:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  features: {
    ondeviceControls: false,
  },
};

export default main;
```

After changing `main.ts`, restart your bundler. The `withStorybook` wrapper regenerates `storybook.requires.ts` automatically on start.

<details>
<summary>Not using a <code>withStorybook</code> wrapper?</summary>

If you're not using the `withStorybook` wrapper, regenerate the requires file manually:

```sh
npx sb-rn-get-stories
```

</details>

To hide the panel for a single story instead, set `parameters.controls.disable` to `true`.

## Coming from `@storybook/addon-ondevice-controls`

Remove `@storybook/addon-ondevice-controls` from `deviceAddons` and uninstall it. Until you do, it keeps working: the package is now an empty stub that registers nothing, so you still get one Controls panel (the built-in one), plus a warning in development reminding you to remove it.

See the [migration guide](https://github.com/storybookjs/react-native/blob/next/MIGRATION.md#controls-are-built-in) for details.

## Optional native modules

The built-in controls need no extra native modules, so they work in Expo Go, on tvOS and macOS, on the old architecture, and before you've rebuilt your app. Two controls use a native module when it's installed and linked into your app, and fall back to a JavaScript control when it isn't:

| Control                              | Optional package                         | With it                                                                     | Without it                                                                  |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `date`                               | `@react-native-community/datetimepicker` | Native date and time pickers: a dialog on Android and a bottom sheet on iOS | Text inputs for the date (`YYYY-MM-DD`) and time (`HH:mm`), with validation |
| `range`, `number` with `range: true` | `@react-native-community/slider`         | The native slider                                                           | A JavaScript slider                                                         |

To use the native versions, install the packages and rebuild your app:

```sh
npx expo install @react-native-community/datetimepicker @react-native-community/slider
npx expo prebuild # or: cd ios && pod install
```

Storybook checks that each package's native side is actually available (the `RNDateTimePicker` view on iOS, the `RNCDatePicker` and `RNCTimePicker` modules on Android, and the `RNCSlider` view), so a package that's installed but not yet linked uses the fallback instead of crashing. In that case you'll see a warning in development telling you to rebuild. The native date picker is only used on iOS and Android; tvOS, macOS and other platforms always use the text inputs.

On web (React Native Web) the date control is an `<input type="datetime-local">`, as before.

`@gorhom/bottom-sheet` is optional too: when it's installed, text inputs inside the full UI's bottom sheet use its keyboard-aware input.

### Using the JavaScript date inputs

Type a date as `YYYY-MM-DD` and a time as `HH:mm` (24 hour). The value is applied when the input loses focus or you press return. An invalid value, like `2024-02-30` or `25:00`, gets a red border and the arg keeps its previous value.

For the full list of control types and `argTypes` options, see the [Controls guide](../addons/controls.md).
