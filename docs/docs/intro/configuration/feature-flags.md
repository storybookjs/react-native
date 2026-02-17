---
sidebar_position: 6
---

# Feature Flags

Feature flags let you opt into new functionality in `@storybook/react-native` without breaking existing behavior. They are configured in your `main.ts` file under the `features` key.

Flags are introduced so you can adopt new APIs at your own pace. In the next major version, the behavior behind these flags will become the default and the flags will no longer be needed.

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

| Flag                  | Description                                                                                                                                                               | Guide                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `ondeviceBackgrounds` | New backgrounds API with globals-based configuration, full-screen support, and no extra package. Available from v10.3. Will become the default in the next major version. | [Backgrounds](./backgrounds.md) |
