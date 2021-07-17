# Storybook Controls Addon for React Native

Storybook Controls Addon for React Native allows editing a component's arguments dynamically via a graphical UI without needing to code. The Controls Addon replaces the old Knobs Addon.

## Installation

```sh
yarn add -D @storybook/addon-ondevice-controls @storybook/addons
```

## Configuration

Then, add following content to `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-ondevice-controls'],
};
```

See the [examples of using the Controls Addon with Component Story Format](../../examples/native/components/ControlExamples). You can also run the [react-native app](../../examples/native) to see it in action.

The [web Controls Addon documentation](https://storybook.js.org/docs/react/essentials/controls) may also be useful, but the examples there have not been tested with Storybook for React Native.

## Migrating from Knobs

See [examples for migrating from Knobs to Controls](https://github.com/storybookjs/storybook/tree/next/addons/controls#how-do-i-migrate-from-addon-knobs) in the web Controls Addon README.
