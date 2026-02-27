# Expo Setup (No Router)

For Expo projects that do **not** use Expo Router.

## Step 1: Run CLI Init

```bash
npm create storybook -- --type react_native --yes
```

## Step 2: Ensure react-native-worklets is installed

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

Chain with other wrappers if needed: `withStorybook(withNativeWind(config), { ... })`.

## Step 4: Create Entrypoint

Conditionally render Storybook based on the env variable. Since `withStorybook` replaces Storybook imports with empty modules when disabled, you can import Storybook at the top level safely:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  if (isStorybook) {
    return <StorybookUI />;
  }

  // Your existing app code here
  return (
    // ...
  );
}
```

## Step 5: Add Scripts

```json
{
  "scripts": {
    "storybook": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start",
    "storybook:ios": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start --ios",
    "storybook:android": "EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start --android"
  }
}
```

## Step 6: Run

```bash
npm run storybook
```
