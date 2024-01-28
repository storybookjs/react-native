# Storybook Knobs Addon for react-native

This addon is depcrecated in favour of controls, please only use it for transitioning to CSF, Args and Controls

See [examples for migrating from Knobs to Controls](https://github.com/storybookjs/storybook/blob/next/code/addons/controls/README.md#how-do-i-migrate-from-addon-knobs) in the web Controls Addon README.

Storybook Knobs Addon allows you to edit react props using the Storybook UI using variables inside stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

**This is a wrapper for the addon @storybook/addon-knobs Refer to its documentation to understand how to use knobs**

## Installation

```sh
yarn add -D @storybook/addon-ondevice-knobs @storybook/addon-knobs  @react-native-community/datetimepicker @react-native-community/slider
```

## Configuration

Add following content to `.storybook/main.ts`:

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: ['@storybook/addon-ondevice-knobs'],
};

export default main;
```

Make sure to use the withKnobs decorator when using knobs `import { withKnobs } from '@storybook/addon-ondevice-knobs';`
