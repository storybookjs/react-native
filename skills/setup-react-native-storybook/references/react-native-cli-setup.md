# React Native CLI Setup (No Expo)

For plain React Native projects using `@react-native-community/cli`.

## Step 1: Run CLI Init

```bash
npm create storybook -- --type react_native --yes
```

## Step 2: Install react-native-reanimated and react-native-worklets

Storybook's default UI depends on `react-native-reanimated` and `react-native-worklets`:

```bash
npm install react-native-reanimated react-native-worklets
```

## Step 3: Install babel-plugin-transform-inline-environment-variables

This allows using `process.env.STORYBOOK_ENABLED` in app code:

```bash
npm install --save-dev babel-plugin-transform-inline-environment-variables
```

Add both plugins to babel config:

```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'transform-inline-environment-variables',
    'react-native-worklets/plugin', // must be last
  ],
};
```

## Step 4: Configure Metro

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

/** @type {import('metro-config').MetroConfig} */
const config = {};

module.exports = withStorybook(mergeConfig(defaultConfig, config), {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

## Step 5: Create Entrypoint

Conditionally render Storybook based on the env variable. Since `withStorybook` replaces Storybook imports with empty modules when disabled, you can import Storybook at the top level safely:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';

const isStorybook = process.env.STORYBOOK_ENABLED === 'true';

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

## Step 6: Install Pods

```bash
cd ios && pod install && cd ..
```

## Step 7: Add Scripts

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED='true' react-native start",
    "storybook:ios": "STORYBOOK_ENABLED='true' react-native run-ios",
    "storybook:android": "STORYBOOK_ENABLED='true' react-native run-android"
  }
}
```

## Step 8: Run

```bash
npm run storybook
```
