---
sidebar_position: 2
---

# Manual Setup

This guide covers setting up Storybook manually without using the CLI. This is useful if you want full control over the setup process or if the CLI doesn't work for your specific project configuration.

You can swap out npm for any other package manager.

## Dependencies

Install the required dependencies:

```bash
npm install storybook @storybook/react-native @react-native-async-storage/async-storage react-dom react-native-safe-area-context react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
```

If you are working with dev clients or React Native CLI, make sure to install pods or run prebuild:

```bash
cd ios; pod install; cd ..;
```

## Files and Folders

Create a folder called `.rnstorybook` with the required configuration files:

```bash
mkdir .rnstorybook
touch .rnstorybook/main.ts .rnstorybook/preview.tsx .rnstorybook/index.tsx
```

### Main Configuration

In `main.ts`, configure the location of your stories and on-device addons:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

### Preview Configuration

In `preview.tsx`, set up any decorators or parameters:

```tsx
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {},
  decorators: [],
};

export default preview;
```

### Storybook UI Export

In `index.tsx`, export the Storybook UI:

```tsx
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

## Bundler Configuration

Update your bundler config to use the `withStorybook` wrapper function. This wrapper auto-detects whether you're using Metro or Re.Pack.

If you are using Expo and don't have a metro config, generate one first:

```bash
npx expo customize metro.config.js
```

Update `metro.config.js`:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig);
```

For React Native CLI projects:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

const config = {};
// set your own config here

const finalConfig = mergeConfig(defaultConfig, config);

module.exports = withStorybook(finalConfig);
```

## storybook.requires.ts

You should also add a storybook-generate script to your project.

In your `package.json` add the following script:

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories"
  }
}
```

You can use this for when you want to manually generate the `storybook.requires.ts` file. However the withStorybook function will automatically generate this file for you when you run your app.

## Running Storybook

No changes to `App.tsx` are needed. When you set `STORYBOOK_ENABLED=true`, the `withStorybook` wrapper automatically swaps your app's entry point with Storybook's entry point.

Add convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true expo start",
    "storybook:ios": "STORYBOOK_ENABLED=true expo start --ios",
    "storybook:android": "STORYBOOK_ENABLED=true expo start --android"
  }
}
```

Then run:

```bash
npm run storybook
```

When the `STORYBOOK_ENABLED` variable is not set, your app runs normally with no Storybook code in the bundle.

<details>
  <summary>Alternative: In-app integration (without entry-point swapping)</summary>

If you prefer to control how Storybook renders in your app, you can import the Storybook UI directly. This approach is fully supported:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
export default StorybookUI;
```

Or conditionally:

```tsx
import StorybookUI from './.rnstorybook';
import { MyApp } from './MyApp';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  return isStorybook ? <StorybookUI /> : <MyApp />;
}
```

</details>
