---
sidebar_position: 7
---

# Backgrounds

`@storybook/react-native` includes a Backgrounds panel. It uses a globals-based configuration that aligns with Storybook web and lets you switch background colors directly on the device, with the background filling the entire screen including safe areas.

It's enabled by default since v11. You don't need to install `@storybook/addon-ondevice-backgrounds` or add it to `deviceAddons`. Stories without backgrounds parameters aren't affected: no background is applied until you configure options.

## Setup

Define background options in `preview.tsx`:

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

## Disabling backgrounds

To hide the panel for a single story, set `parameters.backgrounds.disable`. No background is applied to that story:

```tsx
export const NoBackgrounds: Story = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

To turn the built-in Backgrounds panel off everywhere, set the `ondeviceBackgrounds` [feature flag](./feature-flags.md) to `false` in `main.ts` and restart your bundler:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  features: {
    ondeviceBackgrounds: false,
  },
};

export default main;
```

## Migrating from `@storybook/addon-ondevice-backgrounds`

`@storybook/addon-ondevice-backgrounds` is deprecated. Its `register` entry is a no-op that logs a warning in development, and `withBackgrounds` renders the story unchanged, so existing projects keep working with one Backgrounds panel. To finish migrating:

1. Remove `'@storybook/addon-ondevice-backgrounds'` from `deviceAddons` in `.rnstorybook/main.ts`.
2. Remove `withBackgrounds` from your preview `decorators`.
3. Uninstall the package: `npm uninstall @storybook/addon-ondevice-backgrounds`.
4. Optionally move to the `options` shape, shown below.

The built-in panel still reads the legacy `values` array and `default` name. Legacy values are keyed by `name`, `default` (or the first value when there's no default) is applied while no `backgrounds` global is set, and picking a swatch sets `globals.backgrounds.value` to the value's name.

```diff
 const preview: Preview = {
-  decorators: [withBackgrounds],
   parameters: {
     backgrounds: {
-      default: 'plain',
-      values: [
-        { name: 'plain', value: 'white' },
-        { name: 'dark', value: '#333' },
-      ],
+      options: {
+        plain: { name: 'Plain', value: 'white' },
+        dark: { name: 'Dark', value: '#333' },
+      },
     },
   },
+  initialGlobals: {
+    backgrounds: { value: 'plain' },
+  },
 };
```

A story-level `default` becomes `globals: { backgrounds: { value: 'dark' } }` on the story, which also locks the panel for that story.

|                  | Built in                               | Deprecated addon package                   |
| ---------------- | -------------------------------------- | ------------------------------------------ |
| Install          | No extra package needed                | `@storybook/addon-ondevice-backgrounds`    |
| Decorator        | Not required                           | `withBackgrounds` (now a no-op)            |
| Parameter format | `options` object with `initialGlobals` | `values` array with `default` (still read) |
| Background scope | Full screen including safe areas       | Story view only                            |
| Story locking    | `globals` on meta/story                | Not supported                              |
