---
sidebar_position: 7
---

# Backgrounds

The `ondeviceBackgrounds` [feature flag](./feature-flags.md) enables a Backgrounds panel integrated into core. It lets you switch background colors for your stories directly on the device, with the background filling the entire screen including safe areas.

When this flag is enabled you do **not** need to install `@storybook/addon-ondevice-backgrounds` or add it to your `addons` array.

## Setup

### 1. Enable the feature flag in `main.ts`

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-ondevice-controls'],
  features: {
    ondeviceBackgrounds: true,
  },
};

export default main;
```

### 2. Define background options in `preview.tsx`

```tsx
// .storybook/preview.tsx
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#ffffff' },
        dark: { name: 'Dark', value: '#333333' },
        app: { name: 'App', value: '#eeeeee' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
};

export default preview;
```

- `parameters.backgrounds.options` — an object keyed by identifier. Each entry has a `name` (display label) and `value` (hex color).
- `initialGlobals.backgrounds.value` — sets the initially selected background by its key.

### 3. Regenerate the requires file

After changing `main.ts`, regenerate `storybook.requires.ts` so the flag takes effect:

```sh
npm run storybook-generate
```

Or restart Metro, which regenerates the file automatically.

## Overriding at the story level

You can lock the background for a specific component or story using `globals`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  globals: {
    backgrounds: { value: 'dark' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

When a background is set via `globals` at the story or component level, the Backgrounds panel will show the swatches in a disabled state with a message indicating the background is locked.

## Differences from `@storybook/addon-ondevice-backgrounds`

| | Feature flag | Separate addon package |
|---|---|---|
| Install | No extra package needed | `npm install @storybook/addon-ondevice-backgrounds` |
| Decorator | Not required | `withBackgrounds` decorator required |
| Parameter format | `options` object with `initialGlobals` | `values` array with `default` |
| Background scope | Full screen including safe areas | Story view only |
| Story locking | `globals` on meta/story | Not supported |
