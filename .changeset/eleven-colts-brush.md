---
'@storybook/react-native-ui-common': minor
'@storybook/react-native-ui-lite': minor
'@storybook/react-native-ui': minor
'@storybook/react-native': minor
---

feat: add backgrounds addon behind `features.ondeviceBackgrounds` flag

When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.

### Usage

**1. Enable the feature in `.storybook/main.ts`:**

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
  features: {
    ondeviceBackgrounds: true,
  },
};

export default main;
```

**2. Configure background options in `.storybook/preview.tsx`:**

```tsx
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

**3. Optionally override at the story level:**

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  globals: {
    // Lock background for all stories in this file
    backgrounds: { value: 'dark' },
  },
};

export default meta;
```
