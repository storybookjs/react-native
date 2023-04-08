# Storybook Actions Addon for react-native

Storybook Actions Addon allows you to log events/actions inside stories in [Storybook](https://storybook.js.org).


## Installation

```sh
yarn add -D @storybook/addon-ondevice-actions @storybook/addon-actions
```

## Configuration

Then, add following content to `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-ondevice-actions'],
};
```

The [actions documentation](https://storybook.js.org/docs/react/essentials/actions) may also be useful.
