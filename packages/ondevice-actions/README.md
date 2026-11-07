# Storybook Actions Addon for react-native

Storybook Actions Addon allows you to log events/actions inside stories in [Storybook](https://storybook.js.org).

> **Note:** The Actions panel is also built into `@storybook/react-native` behind the `ondeviceActions` feature flag. If you enable `features: { ondeviceActions: true }` in `.rnstorybook/main.ts`, you don't need this package and should remove it from `deviceAddons`. See the [Actions guide](https://storybookjs.github.io/react-native/docs/intro/configuration/actions).

## Installation

```sh
yarn add -D @storybook/addon-ondevice-actions
```

## Configuration

Then, add following content to `.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  deviceAddons: ['@storybook/addon-ondevice-actions'],
};

export default main;
```

The [actions documentation](https://storybook.js.org/docs/react/essentials/actions) may also be useful.
