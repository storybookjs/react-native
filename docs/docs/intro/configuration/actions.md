---
sidebar_position: 8
---

# Actions

The `ondeviceActions` [feature flag](./feature-flags.md) enables the Actions panel built into `@storybook/react-native`. It logs the events your stories fire (for example `onPress`) so you can check component interactions directly on the device.

This flag was introduced in v11 as a non-breaking way to opt in. **In the next major version this will be the default behavior and the flag will no longer be needed.**

When this flag is enabled you do **not** need to install `@storybook/addon-ondevice-actions` or add it to your `deviceAddons` array.

## Setup

### 1. Enable the feature flag in `main.ts`

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls'],
  features: {
    ondeviceActions: true,
  },
};

export default main;
```

After changing `main.ts`, restart your bundler so the flag takes effect. The `withStorybook` wrapper regenerates `storybook.requires.ts` automatically on start.

<details>
<summary>Not using a <code>withStorybook</code> wrapper?</summary>

If you're not using the `withStorybook` wrapper, regenerate the requires file manually:

```sh
npx sb-rn-get-stories
```

</details>

### 2. Log actions in your stories

Nothing changes in your stories. Use `argTypes` with `action`, or the `fn` helper from `storybook/test`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  component: Button,
  argTypes: {
    onLongPress: { action: 'long pressed' },
  },
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
```

Actions are recorded from the moment Storybook starts, so actions fired while the panel is closed show up when you open it.

## Migrating from `@storybook/addon-ondevice-actions`

1. Add `ondeviceActions: true` to `features` in `main.ts`.
2. Remove `'@storybook/addon-ondevice-actions'` from `deviceAddons`.
3. Optionally uninstall the package:

   ```sh
   npm uninstall @storybook/addon-ondevice-actions
   ```

The built-in panel uses the same addon id as the package, so if you enable the flag and leave the package in `deviceAddons`, the built-in panel replaces the package's one and you won't get a duplicate panel. Storybook logs a warning in development in that case, so it's still best to remove the package.

The panel's parameters are unchanged, so `parameters: { actions: { disable: true } }` still hides it for a story.
