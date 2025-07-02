# Storybook Controls Addon for React Native

Storybook Controls Addon for React Native allows editing a component's arguments dynamically via a graphical UI without needing to code. The Controls Addon replaces the old Knobs Addon.

## Installation

Controls has some extra dependencies needed to display the form inputs.

```sh
yarn add -D @storybook/addon-ondevice-controls @react-native-community/datetimepicker @react-native-community/slider
```

## Configuration

Then, add following content to `.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: ['@storybook/addon-ondevice-controls'],
};

export default main;
```

See the [examples of using the Controls Addon with Component Story Format](../../examples/expo-example/components/ControlExamples). You can also run the [react-native app](../../examples/expo-example) to see it in action.

The [web Controls Addon documentation](https://storybook.js.org/docs/react/essentials/controls) may also be useful, but the examples there have not been tested with Storybook for React Native.

## Migrating from Knobs

See [examples for migrating from Knobs to Controls](https://github.com/storybookjs/storybook/blob/next/code/addons/controls/README.md#how-do-i-migrate-from-addon-knobs) in the web Controls Addon README.
