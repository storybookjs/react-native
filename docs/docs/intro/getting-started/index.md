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

### Update Metro Config

You should then wrap your metro config with the `withStorybook` function that will return an updated config object with the necessary options for Storybook.

If you have other config wrapper functions like `withNativeWind` you will want to chain these functions like `withStorybook(withNativeWind(config))` since they are composable (the order may be important).

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook'); // <-- add this

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config); // <-- add this
```

### Render storybook

Now you need to update your app to render the Storybook component. One way to get storybook to render is to export the Storybook UI from the app entrypoint (usually `App.tsx`). Expand the section below for more information.

The Storybook component is in `.rnstorybook/index.tsx`

> Note the config folder changed to .rnstorybook starting in v9

```ts
// App.tsx
import StorybookUI from './.rnstorybook';
export default StorybookUI;
```

<details>
  <summary>Rendering Storybook</summary>

You don't have to replace your app entry point to render storybook this is just one way to get started.

Other methods involve using env variables or application state to decide if Storybook should render. You can use any logic that you normally would in React to optionally render a component.

Heres one example:

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

</details>

### Run storybook

You can then run your app using the normal commands for react native.

```bash
# to run metro
npm run start
# to run launch ios
npm run ios
# to launch android
npm run android
```

Storybook will render where you have placed it. If you have used an env variable to enable Storybook you will want to make sure that is set when running metro.

If you're using an env variable you can setup some commands like this to run Storybook conditionally.

```json
"storybook": "STORYBOOK_ENABLED='true' expo start",
"storybook:ios": "STORYBOOK_ENABLED='true' expo start --ios",
"storybook:android": "STORYBOOK_ENABLED='true' expo start --android"
```

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
