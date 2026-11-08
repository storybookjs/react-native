---
sidebar_position: 8
---

# Actions

The Actions panel is built into `@storybook/react-native`. It logs the events your stories fire (for example `onPress`) so you can check component interactions directly on the device.

From v11 it is **on by default**: you don't need to install `@storybook/addon-ondevice-actions` or add anything to `deviceAddons`. That package is deprecated and is now an empty stub.

## Logging actions in your stories

Use `argTypes` with `action`, or the `fn` helper from `storybook/test`:

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

To hide the panel for a single story, use `parameters: { actions: { disable: true } }`.

## Turning the panel off

Set the `ondeviceActions` [feature flag](./feature-flags.md) to `false` in `main.ts`:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  features: {
    ondeviceActions: false,
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

## Migrating from `@storybook/addon-ondevice-actions`

1. Remove `'@storybook/addon-ondevice-actions'` from `deviceAddons` in `.rnstorybook/main.ts`.
2. Uninstall the package:

   ```sh
   npm uninstall @storybook/addon-ondevice-actions
   ```

If you leave it installed and listed, Storybook keeps working: the package's `register` no longer registers anything, so you still get exactly one Actions panel (the built-in one), and a warning is logged once in development reminding you to remove it.
