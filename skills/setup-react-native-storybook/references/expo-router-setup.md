# Expo Router Setup

For Expo projects using Expo Router file-based navigation.

## Step 1: Run CLI Init

```bash
npm create storybook -- --type react_native --yes
```

## Step 2: Ensure dependencies are installed

Storybook's default UI depends on `react-native-reanimated` and `react-native-worklets`. If they're not already installed:

```bash
npx expo install --fix react-native-reanimated react-native-worklets
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

Create a route group for Storybook:

```tsx
// app/(storybook)/index.tsx
export { default } from '../../.rnstorybook';
```

## Step 5: Configure Layout

The layout configuration depends on the project's navigation structure. Check whether the project uses **Stack** or **Tabs** navigation and follow the matching pattern below.

### Stack-based layout

Move the existing app routes into a route group (e.g. `app/(pages)/`):

```
app/
├── _layout.tsx
├── (storybook)/
│   └── index.tsx
└── (pages)/
    └── index.tsx    # existing app entry point moved here
```

Update the root layout:

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  initialRouteName: storybookEnabled ? '(storybook)/index' : '(pages)/index',
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={storybookEnabled}>
        <Stack.Screen name="(storybook)/index" />
      </Stack.Protected>
      <Stack.Screen name="(pages)/index" />
    </Stack>
  );
}
```

### Tabs-based layout

Keep the existing `(tabs)/` group and add the `(storybook)/` group alongside it:

```
app/
├── _layout.tsx
├── (storybook)/
│   └── index.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── index.tsx
    └── ...
```

Update the root layout:

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  anchor: storybookEnabled ? '(storybook)' : '(tabs)',
  initialRouteName: storybookEnabled ? '(storybook)' : '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Protected guard={storybookEnabled}>
        <Stack.Screen name="(storybook)/index" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

In both cases, `unstable_settings` ensures the app opens directly to Storybook when `EXPO_PUBLIC_STORYBOOK_ENABLED` is set.

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
