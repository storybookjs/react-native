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

In `main.ts`, configure the location of your stories:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
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

## Metro Configuration

Update `metro.config.js` to use our `withStorybook` wrapper function.

If you are using Expo and don't have a metro config, generate one first:

```bash
npx expo customize metro.config.js
```

Update `metro.config.js`:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig);
```

For React Native CLI projects:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
// set your own config here 👆

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

## Rendering Storybook

Update your app to render the Storybook component. One way to get Storybook to render is to export the Storybook UI from the app entry point (usually `App.tsx`):

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
export default StorybookUI;
```

### Conditional Rendering

You don't have to replace your app entry point to render Storybook. You can use any logic that you normally would in React to optionally render a component.

Here's an example using environment variables:

```tsx
function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
```

## Running Storybook

You can then run your app as normal:

```bash
npm run start
npm run ios     # or npm run android
```

Storybook will render where you have placed it. If you have used an environment variable to enable Storybook, you will want to make sure that is set when running Metro.

If you're using an environment variable, you can set up some commands like this to run Storybook conditionally:

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED='true' expo start",
    "storybook:ios": "STORYBOOK_ENABLED='true' expo start --ios",
    "storybook:android": "STORYBOOK_ENABLED='true' expo start --android"
  }
}
```
