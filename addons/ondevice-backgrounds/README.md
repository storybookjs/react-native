# Storybook Backgrounds Addon for react-native

Storybook Backgrounds Addon for react-native can be used to change background colors of your stories right from the device.

## Installation

```sh
yarn add -D @storybook/addon-ondevice-backgrounds
```

## Configuration

Then, add following content to `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-ondevice-backgrounds'],
};
```

## Usage

See the [example of using the Backgrounds addon with Component Story Format](../../examples/native/components/BackgroundExample/BackgroundCsf.stories.tsx). You can also run the [react-native app](../../examples/native) to see it in action.

The [web backgrounds addon documentation](https://storybook.js.org/docs/react/essentials/backgrounds) may also be useful, but the examples there have not been tested with React-Native Storybook.
