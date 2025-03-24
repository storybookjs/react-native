---
sidebar_position: 2
---

# Getting started

There are a few different ways to get started, the main recommendation is to use the CLI init.
This guide is intended for v9 of storybook.

React Native Storybook works with both plain React Native and Expo but examples are using Expo for brevity since Expo is officially recommended by Meta. For plain React Native projects there should be minimal differences.

## Recommended setup

For most existing projects we recommend adding Storybook via the CLI.

### Init command

Use the storybook cli to add Storybook to your project

```bash
npx storybook@latest init
```

### Update Metro Config

You should then wrap your metro config with the `withStorybook` function that will return an updated config object with the necessary options for Storybook.

If you have other config wrapper functions like `withNativeWind` you will want to chain these functions like `withStorybook(withNativeWind(config))` since they are composable (the order may be important).

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook'); // <-- add this

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
npx react-native init MyApp --template react-native-template-storybook
```

## Starter projects

Theres also these starter projects you can copy or reference whilst building out your own Storybook

https://github.com/dannyhw/expo-storybook-starter

https://github.com/dannyhw/react-native-storybook-starter

## Manual setup

Heres a guide to setting up everything yourself.

You can swap out npm for any other package manager.

### Dependencies

```bash
npm install storybook @storybook/react-native @react-native-async-storage/async-storage react-dom react-native-safe-area-context react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
```

If you are working with dev clients or rn cli then make sure to install pods or run prebuild

```bash
cd ios; pod install; cd ..;
```

### Files and Folders

Create a folder called .storybook with files: main.ts, preview.tsx, index.tsx

You can use this one-liner to quickly create those files:

```bash
mkdir .rnstorybook
touch .rnstorybook/main.ts .rnstorybook/preview.tsx .rnstorybook/index.tsx
```

In `main.ts` configure the location of your stories

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
};

export default main;
```

In `preview.tsx` setup any decorators or parameters

```tsx
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {},
  decorators: [],
};

export default preview;
```

In `index.tsx` export the Storybook ui

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

### Metro

Update `metro.config.js` to use our `withStorybook` wrapper function

If you are using expo and don't have a metro config then generate one first

```bash
npx expo customize metro.config.js
```

Update `metro.config.js`

```js
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook'); // <--- add this

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig); // <-- add this
```

### Render

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

You can then run your app as normal `npm run ios` etc and storybook will render where you have placed it. If you have used an env variable to enable storybook you will want to make sure that is set when running metro.
