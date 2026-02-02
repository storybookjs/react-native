# Expo Router Setup

For Expo projects using Expo Router file-based navigation.

## Step 1: Run CLI Init

```bash
npm create storybook -- --type react_native --yes
```

## Step 2: Ensure react-native-worklets is installed

Storybook's default UI depends on `react-native-reanimated`, which requires `react-native-worklets`. If it's not already installed:

```bash
npm install react-native-worklets
```

Expo handles the babel plugin automatically.

## Step 3: Configure Metro

Generate metro config if needed:

```bash
npx expo@latest customize metro.config.js
```

Wrap with `withStorybook`, using `EXPO_PUBLIC_STORYBOOK_ENABLED` to control inclusion:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

## Step 4: Create Storybook Route

Create a route file:

```tsx
// app/storybook.tsx
export { default } from '../.rnstorybook';
```

## Step 5: Add Protected Route

Add the Storybook screen to the layout with a protected route gated on the env variable, and disable the header:

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Protected guard={storybookEnabled}>
        <Stack.Screen name="storybook" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

Add navigation to `/storybook` in the app (tab, button, or dev menu).

## Step 6: Add Scripts

```json
{
  "scripts": {
    "storybook": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start",
    "storybook:ios": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start --ios",
    "storybook:android": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start --android"
  }
}
```

## Step 7: Run

```bash
npm run storybook
```

Navigate to `/storybook` in the app to view stories.
