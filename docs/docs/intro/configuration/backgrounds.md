---
sidebar_position: 7
---

# Backgrounds

The `ondeviceBackgrounds` [feature flag](./feature-flags.md) enables the new backgrounds API with a Backgrounds panel integrated into core. It uses a globals-based configuration that aligns with Storybook web and lets you switch background colors directly on the device, with the background filling the entire screen including safe areas.

This flag was introduced in v10.3 as a non-breaking way to opt into the new syntax. **In the next major version this will be the default behavior and the flag will no longer be needed.**

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

## Theming with backgrounds

Because backgrounds are driven by globals, you can use a decorator to read the current background and apply a matching theme to your components. This is useful when your app has a theme provider and you want the component styles to update automatically when the background changes.

```tsx
import { createContext, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

// A simple theme system
const themes = {
  light: { card: '#ffffff', text: '#1a1a1a', accent: '#0066cc' },
  dark: { card: '#1e1e1e', text: '#f0f0f0', accent: '#4da6ff' },
};

const ThemeContext = createContext(themes.light);
const useAppTheme = () => useContext(ThemeContext);

const AppThemeProvider = ({ name, children }: { name: 'light' | 'dark'; children: ReactNode }) => (
  <ThemeContext.Provider value={themes[name] ?? themes.light}>{children}</ThemeContext.Provider>
);

// A component that reads the theme
const ThemedCard = ({ title }: { title: string }) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={{ color: theme.accent, fontWeight: '600' }}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 12, margin: 16 },
});

// The decorator maps the backgrounds global to a theme name
const meta: Meta<typeof ThemedCard> = {
  component: ThemedCard,
  decorators: [
    (Story, { globals }) => {
      const themeName = globals.backgrounds?.value === 'dark' ? 'dark' : 'light';
      return (
        <AppThemeProvider name={themeName}>
          <Story />
        </AppThemeProvider>
      );
    },
  ],
  args: { title: 'Hello' },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

When you switch the background in the Backgrounds panel, the decorator picks up the new global and passes the corresponding theme to `AppThemeProvider`, updating the card's colors.

## Differences from `@storybook/addon-ondevice-backgrounds`

|                  | Feature flag                           | Separate addon package                              |
| ---------------- | -------------------------------------- | --------------------------------------------------- |
| Install          | No extra package needed                | `npm install @storybook/addon-ondevice-backgrounds` |
| Decorator        | Not required                           | `withBackgrounds` decorator required                |
| Parameter format | `options` object with `initialGlobals` | `values` array with `default`                       |
| Background scope | Full screen including safe areas       | Story view only                                     |
| Story locking    | `globals` on meta/story                | Not supported                                       |
