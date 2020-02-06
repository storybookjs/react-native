# Storybook Actions Addon for react-native

Storybook Actions Addon allows you to log events/actions inside stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

**This addon is a wrapper for addon [@storybook/addon-actions](https://github.com/storybookjs/storybook/blob/master/addons/actions).
Refer to its documentation to understand how to use actions**

## Installation

```sh
yarn add -D @storybook/addon-ondevice-actions @storybook/addon-actions
```

## Configuration

Create a file called `rn-addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-ondevice-actions/register';
```

Then import `rn-addons.js` next to your `getStorybookUI` call.

```js
import './rn-addons';
```

See [@storybook/addon-actions](https://github.com/storybookjs/storybook/blob/master/addons/actions) to learn how to write stories with actions and the [crna-kitchen-sink app](../../examples/crna-kitchen-sink) for more examples.
