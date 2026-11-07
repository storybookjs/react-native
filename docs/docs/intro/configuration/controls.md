---
sidebar_position: 8
---

# Controls

The `ondeviceControls` [feature flag](./feature-flags.md) enables a Controls panel built into `@storybook/react-native`. It's the same panel as [`@storybook/addon-ondevice-controls`](../addons/controls.md), with the same control types, `argTypes` and `parameters.controls` options, but you don't need to install the addon package.

This flag was introduced in v11 as a non-breaking way to opt in. **In the next major version this will be the default behavior and the flag will no longer be needed.**

When this flag is enabled you do **not** need to install `@storybook/addon-ondevice-controls` or add it to your `deviceAddons` array.

## Setup

### 1. Enable the feature flag in `main.ts`

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-actions'],
  features: {
    ondeviceControls: true,
  },
};

export default main;
```

After changing `main.ts`, restart your bundler so the flag takes effect. The `withStorybook` wrapper regenerates `storybook.requires.ts` automatically on start.

<details>
<summary>Not using a <code>withStorybook</code> wrapper?</summary>

If you're not using the `withStorybook` wrapper, regenerate the requires file manually:

```sh
npx sb-rn-get-stories
```

</details>

### 2. Remove the addon package (optional)

You can remove `@storybook/addon-ondevice-controls` from `deviceAddons` and uninstall it. If it's still listed, the built-in panel replaces it (both register under the same id), so you won't see two Controls panels, and you'll get a warning in development reminding you to remove it.

## Optional native modules

The built-in controls work without any extra native modules, so they work in Expo Go, on tvOS and macOS, on the old architecture, and before you've rebuilt your app. Two controls use a native module when it's installed and linked into your app, and fall back to a JavaScript control when it isn't:

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

`@gorhom/bottom-sheet` is optional too: when the full UI uses it, text inputs in the panel use its keyboard-aware input.

### Using the JavaScript date inputs

Type a date as `YYYY-MM-DD` and a time as `HH:mm` (24 hour). The value is applied when the input loses focus or you press return. An invalid value, like `2024-02-30` or `25:00`, gets a red border and the arg keeps its previous value.

## Differences from `@storybook/addon-ondevice-controls`

|                      | Feature flag                         | Separate addon package                                               |
| -------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| Install              | No extra package needed              | `npm install @storybook/addon-ondevice-controls`                     |
| `deviceAddons` entry | Not needed                           | Required                                                             |
| Date picker          | Optional, with a JavaScript fallback | Requires `@react-native-community/datetimepicker`, linked in the app |
| Slider               | Optional, with a JavaScript fallback | Optional, with a JavaScript fallback                                 |
| Control types        | Same                                 | Same                                                                 |

For the full list of control types and `argTypes` options, see the [Controls addon guide](../addons/controls.md).
