---
sidebar_position: 2
description: Get started with Storybook for React Native. Learn how to install and configure Storybook in your React Native or Expo project with our step-by-step guide.
keywords: [react native, storybook, getting started, installation, setup, expo, metro config]
---

# Getting started

There are a few different ways to get started, the main recommendation is to use the CLI init.
This guide is intended for v10 of storybook. For v9 docs see the [v9.1 docs](https://github.com/storybookjs/react-native/tree/v9.1.4).

React Native Storybook works with both plain React Native and Expo but examples are using Expo for brevity since Expo is officially recommended by Meta. For plain React Native projects there should be minimal differences.

:::info Expo Router Users
If you're using **Expo Router** for file-based navigation, follow our dedicated [Expo Router Setup guide](./expo-router.md) instead of the standard setup below. Expo Router benefits from a specific configuration for routing integration.
:::

:::tip AI-Assisted Setup
If you're using an AI coding agent (Claude Code, Cursor, Windsurf, etc.), you can install our agent skills to get guided setup assistance:

```bash
npx skills add storybookjs/react-native
```

The **setup-react-native-storybook** skill walks your agent through the full setup for Expo, Expo Router, React Native CLI, and Re.Pack projects.
The **upgrading-react-native-storybook** skill handles supported version-to-version migrations one hop at a time instead of attempting a full jump in one pass.
:::

## Recommended setup

For most existing projects we recommend adding Storybook via the CLI.

### Init command

Use the storybook cli to add Storybook to your project

```bash
npm create storybook@latest
```

### Configure your bundler

Wrap your bundler config with the `withStorybook` function. This wrapper auto-detects whether you're using Metro or Re.Pack and configures everything automatically — including entry-point swapping, story generation, and optional WebSocket setup.

If you have other config wrapper functions like `withNativeWind` you will want to chain these functions like `withStorybook(withNativeWind(config))` since they are composable (the order may be important).

**Expo:**

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

**React Native CLI:**

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);
const config = {};

module.exports = withStorybook(mergeConfig(defaultConfig, config));
```

### Run Storybook

That's it — no changes to `App.tsx` are needed. When you set `STORYBOOK_ENABLED=true`, the wrapper automatically swaps your app's entry point with Storybook's entry point. When the variable is not set, your app runs normally with zero Storybook code in the bundle.

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

:::note Windows
Use `cross-env` to set environment variables on Windows:

```json
"storybook": "cross-env STORYBOOK_ENABLED=true expo start"
```

:::

<details>
  <summary>Alternative: In-app integration (without entry-point swapping)</summary>

If you prefer to control how Storybook renders in your app (for example, to render it alongside your app or behind a toggle), you can import the Storybook UI directly in your `App.tsx`. This approach is fully supported:

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

Note that with this approach you'll need to manage the `enabled` option in your metro config yourself. See [Metro Configuration](../configuration/metro-configuration.md) for details.

</details>

## Project Template

If you are starting a fresh project and you want to get setup with Storybook from the beginning then these templates can be used to get up and running quickly. These templates come with React Native and React Native Web (vite) Storybook configured already.

For Expo you can use this template with the following command:

```bash
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

For React Native cli you can use this template

```bash
npx @react-native-community/cli init MyApp --template react-native-template-storybook
```

## Starter projects

Theres also these starter projects you can copy or reference whilst building out your own Storybook

https://github.com/dannyhw/expo-storybook-starter

https://github.com/dannyhw/react-native-storybook-starter

## Alternative Setup Methods

Depending on your project setup and requirements, you may need different installation approaches:

- **[Expo Router Setup](./expo-router.md)** - For projects using Expo Router file-based navigation
- **[Re.Pack Setup](./repack.md)** - For projects using Re.Pack (Rspack/Webpack) instead of Metro
- **[Manual Setup](./manual-setup.md)** - For full control over the setup process or when the CLI doesn't work for your specific configuration

## Migrating from an older setup?

If you set up Storybook before entry-point swapping was available and want to switch from the deep app integration approach, see the [Migration Guide](./migrating-to-entry-point-swapping.md).
