---
sidebar_position: 6
---

# Feature Flags

Feature flags let you opt into new functionality in `@storybook/react-native` without breaking existing behavior. They are configured in your `main.ts` file under the `features` key.

Most flags are introduced so you can adopt new APIs at your own pace; in the next major version their behavior becomes the default. Some flags, like `ondeviceControls`, are on by default and let you opt out.

## Configuration

Add the `features` object to your `main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-actions'],
  features: {
    ondeviceBackgrounds: true,
    // On by default; set to false to turn off the built-in Controls panel.
    // ondeviceControls: false,
  },
};

export default main;
```

Feature flags are set on `globalThis.FEATURES` via the generated `storybook.requires.ts` file, so they are available before Storybook initialises.

## Available Flags

| Flag                  | Description                                                                                                                                                                                                                      | Guide                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `ondeviceBackgrounds` | New backgrounds API with globals-based configuration, full-screen support, and no extra package. Available from v10.3. Will become the default in the next major version.                                                        | [Backgrounds](./backgrounds.md) |
| `ondeviceControls`    | The built-in Controls panel. **On by default** from v11; set to `false` to turn it off. `@storybook/addon-ondevice-controls` is no longer needed, and the native date picker and slider are optional, with JavaScript fallbacks. | [Controls](./controls.md)       |
