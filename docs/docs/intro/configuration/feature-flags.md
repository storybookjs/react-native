---
sidebar_position: 6
---

# Feature Flags

Feature flags turn functionality in `@storybook/react-native` on or off. They are configured in your `main.ts` file under the `features` key.

## Configuration

Add the `features` object to your `main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
  features: {
    // Turn off the built-in Backgrounds panel
    ondeviceBackgrounds: false,
  },
};

export default main;
```

Feature flags are set on `globalThis.FEATURES` via the generated `storybook.requires.ts` file, so they are available before Storybook initialises.

## Available Flags

| Flag                  | Default | Description                                                                                                                                                     | Guide                           |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `ondeviceBackgrounds` | `true`  | Built-in Backgrounds panel with globals-based configuration and full-screen backgrounds. Set to `false` to disable it. Added in v10.3, on by default since v11. | [Backgrounds](./backgrounds.md) |
