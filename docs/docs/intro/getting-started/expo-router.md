---
sidebar_position: 1
---

# Expo Router Setup

This guide covers setting up Storybook as a route inside an Expo Router app. This approach renders Storybook within your app's navigation — useful if you want Storybook accessible alongside your app screens during development.

:::tip Recommended: Entry-point swapping
For most projects, the simpler approach is **entry-point swapping** — the bundler swaps your entire app entry point for Storybook when `STORYBOOK_ENABLED=true` is set. No route setup needed, no Storybook code in production. See the [Getting Started guide](./index.md).

The Expo Router approach documented here is fully supported but not the preferred setup, because it embeds Storybook into your app's bundle and navigation.
:::

## Metro Configuration

Generate a metro config if you don't have one:

```sh
npx expo@latest customize metro.config.js
```

Since this approach renders Storybook inside your app (not as a separate entry point), use the **Metro-specific** `withStorybook` wrapper with the `enabled` option:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: true,
});
```

:::warning Don't use the bundler-agnostic wrapper here
The bundler-agnostic `withStorybook` from `@storybook/react-native/withStorybook` performs entry-point swapping, which replaces your entire app with Storybook. For the Expo Router route approach, you need the Metro-specific wrapper from `@storybook/react-native/metro/withStorybook` so your app's routing stays intact.
:::

## Creating the Storybook Route

Create a route file that sets up the Storybook UI directly. You'll import `view` from the generated `storybook.requires` file in your `.rnstorybook` folder:

**app/storybook.tsx**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from '../.rnstorybook/storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

## Navigation Setup

Add navigation to your Storybook route. You can do this through tab navigation, stack navigation, or a dev menu.

### Recommended Route Configuration

For the best Storybook experience, disable the header for the Storybook route in your root layout:

**app/\_layout.tsx**

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="storybook" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### Development-Only Access (Protected Routes)

For production builds, you may want to hide the Storybook route entirely. You can use Expo Router's protected routes feature to only show Storybook in development mode:

**app/\_layout.tsx**

```tsx
import { Stack } from 'expo-router';

const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isDevelopment}>
        <Stack.Screen name="storybook" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

This ensures that the Storybook route is only available during development and won't be accessible in production builds.

## Running Your App

Once set up, start your app and navigate to the `/storybook` route:

```sh
npm run start
npm run ios    # or npm run android
```

Navigate to `/storybook` in your app to view your stories.

## Video Tutorial

For a visual walkthrough of this setup process, watch this video tutorial:

<iframe width="560" style={{maxWidth:"95%"}} height="315" src="https://www.youtube.com/embed/egBqrYg0AIg" title="Expo Router + Storybook Setup" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
