# Storybook Backgrounds Addon for React Native

Storybook Backgrounds Addon for React Native can be used to change background colors of your stories right from the device.

## Installation

```sh
yarn add -D @storybook/addon-ondevice-backgrounds
```

## Configuration

Then, add following content to `.storybook/main.ts`:

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: ['@storybook/addon-ondevice-backgrounds'],
};

export default main;
```

## Usage

See the [example of using the Backgrounds Addon with Component Story Format](../../examples/expo-example/components/BackgroundExample/BackgroundCsf.stories.tsx). You can also run the [react-native app](../../examples/expo-example) to see it in action.

The [web Backgrounds Addon documentation](https://storybook.js.org/docs/react/essentials/backgrounds) may also be useful, but the examples there have not been tested with Storybook for React Native.
