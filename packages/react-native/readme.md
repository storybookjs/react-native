# Storybook for React Native

A new docs site is being built for Storybook for React Native, you can find it at https://storybookjs.github.io/react-native/docs/intro/.

> [!IMPORTANT]
> This readme is for v10, for v9 docs see the [v9.1 docs](https://github.com/storybookjs/react-native/tree/v9.1.4).

With Storybook for React Native you can design and develop individual React Native components without running your app.

If you are migrating from 9 to 10 you can find the migration guide [here](https://github.com/storybookjs/react-native/blob/next/MIGRATION.md#from-version-9-to-10)

For more information about storybook visit: [storybook.js.org](https://storybook.js.org)

> [!NOTE]
> Make sure you align your storybook dependencies to the same major version or you will see broken behaviour.

![picture of storybook](https://github.com/user-attachments/assets/cf98766d-8b90-44ab-b718-94ab16e63205)

## Table of contents

- 🚀 [Getting Started](#getting-started)
- 📒 [Writing stories](#writing-stories)
- 🔌 [Addons](#addons)
- 📱 [Hide/Show Storybook](#hideshow-storybook)
- ⚙️ [withStorybook wrapper](#withstorybook-wrapper)
- 🔧 [getStorybookUI](#getstorybookui-options)
- 🧪 [Using stories in unit tests](#using-stories-in-unit-tests)
- 🤝 [Contributing](#contributing)
- ✨ [Examples](#examples)

## Getting Started

### New project

There is some project boilerplate with `@storybook/react-native` and `@storybook/addon-react-native-web` both already configured with a simple example.

For Expo you can use this [template](https://github.com/dannyhw/expo-template-storybook) with the following command

```sh
# With NPM
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

For React Native CLI you can use this [template](https://github.com/dannyhw/react-native-template-storybook)

```sh
npx @react-native-community/cli init MyApp --template react-native-template-storybook
```

### Existing project

Run init to setup your project with all the dependencies and configuration files:

```sh
npm create storybook@latest
```

The only thing left to do is return Storybook's UI in your app entry point (such as `App.tsx`) like this:

```tsx
export { default } from './.rnstorybook';
```

Then wrap your metro config with the withStorybook function as seen [below](#additional-steps-update-your-metro-config)

If you want to be able to swap easily between storybook and your app, have a look at this [blog post](https://dev.to/dannyhw/how-to-swap-between-react-native-storybook-and-your-app-p3o)

If you want to add everything yourself check out the manual guide [here](https://github.com/storybookjs/react-native/blob/next/MANUAL_SETUP.md).

#### Additional steps: Update your metro config

We require the unstable_allowRequireContext transformer option to enable dynamic story imports based on the stories glob in `main.ts`. We can also call the storybook generate function from the metro config to automatically generate the `storybook.requires.ts` file when metro runs.

**Expo**

First create metro config file if you don't have it yet.

```sh
npx expo customize metro.config.js
```

Then wrap your config in the withStorybook function as seen below.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

// For basic usage with all defaults, this is all you need
module.exports = withStorybook(config);

// Or customize the options
module.exports = withStorybook(config, {
  // When false, removes Storybook from bundle (useful for production)
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',

  // Path to your storybook config (default: './.rnstorybook')
  configPath: './.rnstorybook',

  // Optional websockets configuration for syncing between devices
  // websockets: {
  //   port: 7007,
  //   host: 'localhost',
  // },
});
```

**React Native**

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

// For basic usage with all defaults
module.exports = withStorybook(finalConfig);

// Or customize the options
module.exports = withStorybook(finalConfig, {
  // When false, removes Storybook from bundle (useful for production)
  enabled: process.env.STORYBOOK_ENABLED === 'true',

  // Path to your storybook config (default: './.rnstorybook')
  configPath: path.resolve(__dirname, './.rnstorybook'),
  // note that this is the default so you can the config path blank if you use .rnstorybook

  // Optional websockets configuration for syncing between devices
  // Starts a websocket server on the specified port and host on metro start
  // websockets: {
  //   port: 7007,
  //   host: 'localhost',
  // },
});
```

#### Reanimated setup

Make sure you have `react-native-reanimated` in your project and the plugin setup in your babel config.

```js
// babel.config.js
plugins: ['react-native-reanimated/plugin'],
```

## Expo router specific setup

```bash
npm create storybook@latest
```

choose recommended and then native

```bash
npx expo@latest customize metro.config.js
```

copy the metro config

```js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
module.exports = withStorybook(config);
```

add storybook screen to app

create `app/storybook.tsx`

```tsx
export { default } from '../.rnstorybook';
```

Then add a way to navigate to your storybook route and I recommend disabling the header for the storybook route.

Here's a video showing the same setup:

https://www.youtube.com/watch?v=egBqrYg0AIg

## Writing stories

In Storybook we use a syntax called CSF that looks like this:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyButton } from './Button';

const meta = {
  component: MyButton,
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Hello World',
    color: 'purple',
  },
};
```

You should configure the path to your story files in the `main.ts` config file from the `.rnstorybook` folder.

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
};

export default main;
```

### Decorators and Parameters

For stories you can add decorators and parameters on the default export or on a specific story.

```tsx
import type { Meta } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
```

For global decorators and parameters, you can add them to `preview.tsx` inside your `.rnstorybook` folder.

```tsx
// .rnstorybook/preview.tsx
import type { Preview } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  decorators: [
    withBackgrounds,
    (Story) => (
      <View style={{ flex: 1, color: 'blue' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'plain',
      values: [
        { name: 'plain', value: 'white' },
        { name: 'warm', value: 'hotpink' },
        { name: 'cool', value: 'deepskyblue' },
      ],
    },
  },
};

export default preview;
```

## Addons

The cli will install some basic addons for you such as controls and actions.
Ondevice addons are addons that can render with the device ui that you see on the phone.

Currently, the addons available are:

- [`@storybook/addon-ondevice-controls`](https://storybook.js.org/addons/@storybook/addon-ondevice-controls): adjust your components props in realtime
- [`@storybook/addon-ondevice-actions`](https://storybook.js.org/addons/@storybook/addon-ondevice-actions): mock onPress calls with actions that will log information in the actions tab
- [`@storybook/addon-ondevice-notes`](https://storybook.js.org/addons/@storybook/addon-ondevice-notes): Add some Markdown to your stories to help document their usage
- [`@storybook/addon-ondevice-backgrounds`](https://storybook.js.org/addons/@storybook/addon-ondevice-backgrounds): change the background of storybook to compare the look of your component against different backgrounds

Install each one you want to use and add them to the `main.ts` addons list as follows:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // ... rest of config
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

export default main;
```

### Using the addons in your story

For details of each ondevice addon you can see the readme:

- [actions](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-actions#readme)
- [backgrounds](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-backgrounds#readme)
- [controls](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-controls#readme)
- [notes](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-notes#readme)

## Hide/Show storybook

In v10, you have flexible options for integrating Storybook into your app:

### Option 1: Direct export (simplest)

Just export Storybook directly. Control inclusion via the metro config `enabled` flag:

```tsx
// App.tsx
export { default } from './.rnstorybook';
```

```js
// metro.config.js
module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

When `enabled: false`, Metro automatically removes Storybook from your bundle.

### Option 2: Conditional rendering

If you want to switch between your app and Storybook at runtime:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
import { MyApp } from './MyApp';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  return isStorybook ? <StorybookUI /> : <MyApp />;
}
```

### Option 3: Expo Router (recommended for Expo)

Create a dedicated route for Storybook:

```tsx
// app/storybook.tsx
export { default } from '../.rnstorybook';
```

Then navigate to `/storybook` in your app to view stories.

## withStorybook wrapper

`withStorybook` is a wrapper function to extend your [Metro config](https://metrobundler.dev/docs/configuration) for Storybook. It accepts your existing Metro config and an object of options for how Storybook should be started and configured.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  // See API section below for available options
});
```

### Options

#### enabled

Type: `boolean`, default: `true`

Controls whether Storybook is included in your app bundle. When `true`, enables Storybook metro configuration and generates the `storybook.requires` file. When `false`, removes all Storybook code from the bundle by replacing imports with empty modules.

This is useful for conditionally including Storybook in development but excluding it from production builds:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  // ... other options
});
```

#### useJs

Type: `boolean`, default: `false`

Generates the `.rnstorybook/storybook.requires` file in JavaScript instead of TypeScript.

#### configPath

Type: `string`, default: `path.resolve(process.cwd(), './.rnstorybook')`

The location of your Storybook configuration directory, which includes `main.ts` and other project-related files.

#### docTools

Type: `boolean`, default: `true`

Whether to include doc tools in the storybook.requires file. Doc tools provide additional documentation features and work with `babel-plugin-react-docgen-typescript`.

#### liteMode

Type: `boolean`, default: `false`

Whether to use lite mode for Storybook. In lite mode, the default Storybook UI is mocked out so you don't need to install all its dependencies like react-native-reanimated. This is useful for reducing bundle size and dependencies. Use this when using @storybook/react-native-ui-lite instead of @storybook/react-native-ui.

### websockets

Type: `{ host: string?, port: number? }`, default: `undefined`

If specified, create a WebSocket server on startup. This allows you to sync up multiple devices to show the same story and [arg](https://storybook.js.org/docs/writing-stories/args) values connected to the story in the UI.

### websockets.host

Type: `string`, default: `'localhost'`

The host on which to run the WebSocket, if specified.

### websockets.port

Type: `number`, default: `7007`

The port on which to run the WebSocket, if specified.

## getStorybookUI options

You can pass these parameters to getStorybookUI call in your storybook entry point:

```ts
{
    // initialize storybook with a specific story.  eg: `mybutton--largebutton` or `{ kind: 'MyButton', name: 'LargeButton' }`
    initialSelection?: string | Object;
    // Custom storage to be used instead of AsyncStorage
    storage?: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
    };
    // show the onDevice UI
    onDeviceUI?: boolean;
    // enable websockets for the Storybook UI
    enableWebsockets?: boolean;
    // query params for the websocket connection
    query?: string;
    // host for the websocket connection
    host?: string;
    // port for the websocket connection
    port?: number;
    // use secured websockets
    secured?: boolean;
    // store the last selected story in the device's storage
    shouldPersistSelection?: boolean;
    // theme for the Storybook UI
    theme: Partial<Theme>;
}
```

## Using stories in unit tests

Storybook provides testing utilities that allow you to reuse your stories in external test environments, such as Jest. This way you can write unit tests easier and reuse the setup which is already done in Storybook, but in your unit tests. You can find more information about it in the [portable stories section](./PORTABLE_STORIES.md).

## Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](../../CONTRIBUTING.md) to get started,
  or find us on [Discord](https://discord.gg/sMFvFsG) and look for the react-native channel.

Looking for a first issue to tackle?

- We tag issues with [Good First Issue](https://github.com/storybookjs/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) when we think they are well suited for people who are new to the codebase or OSS in general.
- [Talk to us](https://discord.gg/sMFvFsG), we'll find something to suits your skills and learning interest.

## Examples

Here are some example projects to help you get started

- A mono repo setup by @axeldelafosse https://github.com/axeldelafosse/storybook-rnw-monorepo
- Expo setup https://github.com/dannyhw/expo-storybook-starter
- React Native CLI setup https://github.com/dannyhw/react-native-storybook-starter
- Adding a separate entry point and dev menu item in native files for RN CLI project: https://github.com/zubko/react-native-storybook-with-dev-menu
- Want to showcase your own project? open a PR and add it to the list!
