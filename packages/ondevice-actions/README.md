# Storybook Actions Addon for react-native

Storybook Actions Addon allows you to log events/actions inside stories in [Storybook](https://storybook.js.org).

## Installation

```sh
yarn add -D @storybook/addon-ondevice-actions
```

## Configuration

Then, add following content to `.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: ['@storybook/addon-ondevice-actions'],
};

export default main;
```

The [actions documentation](https://storybook.js.org/docs/react/essentials/actions) may also be useful.
