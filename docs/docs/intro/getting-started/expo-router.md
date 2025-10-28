---
sidebar_position: 1
---

# Expo Router Setup

This guide covers setting up Storybook with Expo Router projects. Expo Router uses file-based routing, so the setup is slightly different from standard Expo projects.

## Installation

Use the Storybook CLI to add Storybook to your Expo Router project:

```bash
npm create storybook@latest
```

When prompted, choose **recommended** and then **native**.

## Metro Configuration

Customize your Metro config to work with Storybook:

```bash
npx expo@latest customize metro.config.js
```

Then update your `metro.config.js` file to include the Storybook wrapper:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

## Creating the Storybook Route

Create a new route file for Storybook in your `app` directory:

**app/storybook.tsx**

```tsx
export { default } from '../.rnstorybook';
```

## Navigation Setup

Add navigation to your Storybook route. You can do this through:

1. **Tab navigation** - Add a tab for Storybook in your tab navigator
2. **Stack navigation** - Add a button or link that navigates to `/storybook`
3. **Dev menu** - Create a development-only way to access Storybook

### Recommended Route Configuration

For the best Storybook experience, disable the header for the Storybook route. You can do this in your root layout file by configuring the screen options for the storybook route:

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

Once set up, you can navigate to your Storybook route within your Expo Router app:

```bash
npm run start
npm run ios    # or npm run android
```

Navigate to `/storybook` in your app to view your stories.

## Video Tutorial

For a visual walkthrough of this setup process, watch this video tutorial:

<iframe width="560" style={{maxWidth:"95%"}} height="315" src="https://www.youtube.com/embed/egBqrYg0AIg" title="Expo Router + Storybook Setup" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
