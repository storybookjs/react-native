---
sidebar_position: 6
---

# Feature Flags

Feature flags let you enable new functionality in `@storybook/react-native`. They are configured in your `main.ts` file under the `features` key.

## Configuration

Add the `features` object to your `main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
  features: {
    ondeviceBackgrounds: true,
  },
};

export default main;
```

Feature flags are set on `globalThis.FEATURES` via the generated `storybook.requires.ts` file, so they are available before Storybook initialises.

## Available Flags

| Flag                  | Description                                                                           | Guide                           |
| --------------------- | ------------------------------------------------------------------------------------- | ------------------------------- |
| `ondeviceBackgrounds` | Backgrounds panel integrated into core with full-screen support and globals-based API | [Backgrounds](./backgrounds.md) |
