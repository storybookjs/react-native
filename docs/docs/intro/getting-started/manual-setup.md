---
sidebar_position: 2
---

# Manual Setup (In-App Integration)

This guide covers integrating Storybook directly into your app — rendering it inside your `App.tsx`, behind a toggle, or on a dedicated screen. This gives you full control over when and how Storybook appears.

:::tip[Recommended: Automated setup with entry-point swapping]
For most projects, the [Getting Started guide](./index.md) is the easier path. The CLI sets everything up automatically, and Storybook runs as its own entry point — no changes to your app code needed.

The approach described on this page is fully supported but requires more manual work to set up and maintain.
:::

## When to use this approach

Use manual in-app integration when you want to:

- Render Storybook behind a toggle or dev menu inside your app
- Control exactly where and how Storybook appears in your navigation
- Avoid entry-point swapping for architectural reasons

If you're using **Expo Router** and want Storybook as a route (e.g. `/storybook`), see the dedicated [Expo Router Setup](./expo-router.md) guide instead.

## Dependencies

Install the required dependencies (swap `npm` for your preferred package manager):

```sh
npm install storybook @storybook/react-native @react-native-async-storage/async-storage react-dom react-native-safe-area-context react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
```

If you are working with dev clients or React Native CLI, make sure to install pods or run prebuild:

```sh
cd ios; pod install; cd ..;
```

## Storybook Configuration

Create a folder called `.rnstorybook` with the required configuration files:

```sh
mkdir .rnstorybook
touch .rnstorybook/main.ts .rnstorybook/preview.tsx .rnstorybook/index.tsx
```

### main.ts

Configure the location of your stories and on-device addons:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

### preview.tsx

Set up any global decorators or parameters:

```tsx
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {},
  decorators: [],
};

export default preview;
```

### index.tsx

Export the Storybook UI. This is the component you'll render in your app:

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

Since this approach renders Storybook inside your app (not as a separate entry point), use the **Metro-specific** `withStorybook` wrapper. This gives you direct control over the `enabled` option without triggering entry-point swapping.

If you are using Expo and don't have a metro config, generate one first:

```sh
npx expo customize metro.config.js
```

**Expo:**

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

**React Native CLI:**

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);
const config = {};

module.exports = withStorybook(mergeConfig(defaultConfig, config), {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

:::warning[Don't use the bundler-agnostic wrapper here]
The bundler-agnostic `withStorybook` from `@storybook/react-native/withStorybook` performs entry-point swapping, which replaces your entire app entry point with Storybook. For in-app integration, you need the Metro-specific wrapper from `@storybook/react-native/metro/withStorybook` so your app remains the entry point and you control where Storybook renders.
:::

See [Metro Configuration](../configuration/metro-configuration.md) for the full options reference.

## storybook.requires.ts

The `withStorybook` wrapper automatically generates and updates the `storybook.requires.ts` file whenever your app starts. You don't need to do anything extra.

If you choose **not** to use the `withStorybook` wrapper at all, you'll need to generate/update this file manually by adding and triggering a script to your `package.json`:

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories"
  }
}
```

Run `npm run storybook-generate` whenever you add, remove, or rename story files.

## Rendering Storybook in Your App

Import `StorybookUIRoot` from `.rnstorybook` and render it somewhere in your app.

**Always show Storybook** (simplest for development):

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
export default StorybookUI;
```

**Conditionally toggle** between your app and Storybook:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
import { MyApp } from './MyApp';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  return isStorybook ? <StorybookUI /> : <MyApp />;
}
```

## Running Storybook

Start your app with the environment variable set:

```sh
STORYBOOK_ENABLED=true expo start
```

Or add convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "storybook": "EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start"
  }
}
```

## Migrating to entry-point swapping

If you later decide to switch to the recommended entry-point swapping approach, see the [Migration Guide](./migrating-to-entry-point-swapping.md) for step-by-step instructions.
