# Storybook Knobs Addon for react-native

Storybook Knobs Addon allows you to edit react props using the Storybook UI using variables inside stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

**This is a wrapper for the addon [@storybook/addon-knobs](https://github.com/storybookjs/storybook/blob/master/addons/knobs).
Refer to its documentation to understand how to use knobs**

## Installation

```sh
yarn add -D @storybook/addon-ondevice-knobs @storybook/addon-knobs
```

## Configuration

Create a file called `rn-addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-ondevice-knobs/register';
```

Then import `rn-addons.js` next to your `getStorybookUI` call.

```js
import './rn-addons';
```

See [@storybook/addon-knobs](https://github.com/storybookjs/storybook/blob/master/addons/knobs) to learn how to write stories with knobs and the [crna-kitchen-sink app](../../examples/crna-kitchen-sink) for more examples.
