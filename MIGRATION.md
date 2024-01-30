# Migration

- [Migration](#migration)
  - [From version 6.5.x to 7.6.x](#from-version-65x-to-76x)
    - [Dependencies](#dependencies)
    - [Regenerate your requires file](#regenerate-your-requires-file)
    - [Update `.storybook/index.js`](#update-storybookindexjs)
    - [Metro config](#metro-config)
      - [Expo](#expo)
      - [React Native CLI](#react-native-cli)
    - [Types](#types)
    - [doctools](#doctools)
    - [(optional) react-native-server](#optional-react-native-server)
      - [First install necessary packages](#first-install-necessary-packages)
      - [Update package.json scripts](#update-packagejson-scripts)
      - [Create .storybook-web config folder](#create-storybook-web-config-folder)
  - [6.5.x to 7.6.x with storiesOf support](#65x-to-76x-with-storiesof-support)
    - [Update dependencies](#update-dependencies)
    - [Update your package.json scripts](#update-your-packagejson-scripts)
    - [Regenerate your requires file](#regenerate-your-requires-file-1)
    - [Update `.storybook/index.js`](#update-storybookindexjs-1)
    - [Update your stories](#update-your-stories)
    - [Types](#types-1)
  - [From version 5.3.x to 6.5.x](#from-version-53x-to-65x)
    - [Additional dependencies](#additional-dependencies)
      - [Controls (the new knobs)](#controls-the-new-knobs)
      - [Actions](#actions)
    - [`.storybook` folder](#storybook-folder)
    - [Update your `index.js` file](#update-your-indexjs-file)
    - [Add a `main.js` and `preview.js`](#add-a-mainjs-and-previewjs)
    - [Scripts in package.json](#scripts-in-packagejson)
    - [Update your metro config](#update-your-metro-config)
    - [Convert your stories to CSF](#convert-your-stories-to-csf)
    - [Theming](#theming)
    - [Test ids for tabs](#test-ids-for-tabs)
    - [The server](#the-server)

## From version 6.5.x to 7.6.x

In this version of storybook we've a lot of changes to the internals of react native storybook to make it more compatible with core storybook libraries. This means compatibility with the new v7 store and the api changes that comes with that.

Here are some of the other improvements:

- New storage option that lets you choose what storage solution you want to use (async storage/mmkv etc).
- Support for main.ts
- Dynamic imports enabled by the unstable_useRequireContext option in metro config.
  - you only need to generate your requires file when main.ts changes.
- Error boundaries for stories so your app shouldn't crash when a story throws an error.
- Improved markdown renderer for notes addon.
- Simpler setup for auto args.

> [!NOTE]  
> You should follow a different set of changes if you need to support storiesOf, see [6.5.x to 7.6.x with storiesOf support](#65x-to-76x-with-storiesof-support)

### Dependencies

Update all storybook dependencies to 7.6.10 or newer.

For example you may end up with something like this

```json
{
  "@storybook/react-native": "^7.6.10",
  "@storybook/addon-ondevice-actions": "^7.6.10",
  "@storybook/addon-ondevice-backgrounds": "^7.6.10",
  "@storybook/addon-ondevice-controls": "^7.6.10",
  "@storybook/addon-ondevice-notes": "^7.6.10"
}
```

### Regenerate your requires file

Regenerate your `storybook.requires` file by running `yarn storybook-generate`.

It should now generate a `storybook.requires.ts` file instead of a `storybook.requires.js` file.

This provides the type for the new view export.

### Update `.storybook/index.js`

Update `.storybook/index.js` to use the new `getStorybookUI` function on the `view` exported from `storybook.requires.ts`.
You can also change this file to be called `.storybook/index.tsx`.

You should also now pass a storage object to the `getStorybookUI` function. This is used to persist the selected story between reloads.

```tsx
// .storybook/index.tsx
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUI;
```

### Metro config

Update your `metro.config.js` to enable the `unstable_useRequireContext` option and you can now remove the sbmodern resolver if you have it.

> [!NOTE]
> The unstable_useRequireContext option requires at least react native 0.72

If you are using expo and you don't have a metro config file you can create one by running `npx expo customize metro.config.js`.

You can also add here the generate function to automatically update the `storybook.requires.ts` file when you start metro.

You only need to regenerate this file now when main.js updates since requireContext allows us to use dynamic imports.

#### Expo

```js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  // update ./.storybook to your storybook folder
  configPath: path.resolve(__dirname, './.storybook'),
});

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.unstable_allowRequireContext = true;

// if you are using expo 50 or newer you can safely remove this line
defaultConfig.resolver.sourceExts.push('mjs');

module.exports = defaultConfig;
```

#### React Native CLI

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  // update ./.storybook to your storybook folder
  configPath: path.resolve(__dirname, './.storybook'),
});

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    unstable_allowRequireContext: true,
  },
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, mjs],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

You can now also remove anything from package.json scripts which would run generate before running storybook.

### Types

We've removed the types from `@storybook/react-native` and now you should import them from `@storybook/react`. This is to remove duplication and increase compatibility with core storybook libraries.

Heres an example story in version 7:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Press me!',
  },
};
```

You can now also update main.js to main.ts and use the StorybookConfig type. This is one of the only types we export from @storybook/react-native in this version.

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
	stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)']
	addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
}

export default main;
```

To update preview.js to preview.tsx you can use the Preview type from @storybook/react

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
	decorators: []
  parameters: {}
};

export default preview;
```

### doctools

If you are manually adding doctools to do auto args you can now remove this code since its automatically added now.
To make it work you still need babel-plugin-react-docgen-typescript though.

```diff
-import { extractArgTypes } from "@storybook/react/dist/modern/client/docs/extractArgTypes";
-import { addArgTypesEnhancer, addParameters } from "@storybook/react-native";
-import { enhanceArgTypes } from "@storybook/docs-tools";

-addArgTypesEnhancer(enhanceArgTypes);
-addParameters({
-  docs: {
-    extractArgTypes,
-  },
-});
```

### (optional) react-native-server

In version 7 it wasn’t possible to update `@storybook/react-native-server` as it was. Instead we’ve released a new ReactJS addon called `@storybook/addon-react-native-server`. With this new addon you will need to setup a ReactJS storybook with a separate storybook config. The benefit of this setup is that its possible to get a web preview of the components if your components are compatible with react-native-web.

There will shortly be a proper guide to setting this up, however the basics will be covered here.

The setup is the same as `@storybook/addon-react-native-web` but with the reactNativeServerOptions property in the config file.

#### First install necessary packages

```bash
yarn add -D @storybook/addon-react-native-web @storybook/addon-essentials storybook @storybook/react-webpack5 @storybook/react babel-plugin-react-native-web react-native-web @storybook/addon-react-native-server
```

With expo you should also add `@expo/metro-runtime`.

#### Update package.json scripts

```json
"storybook:web": "storybook dev -p 6006 -c .storybook-web",
"build-storybook": "storybook build -c .storybook-web"
```

#### Create .storybook-web config folder

Add a `main.ts`

```typescript
// .storybook-web/main.ts
import type { StorybookConfig } from '@storybook/react-webpack5';

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-react-native-server',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  reactNativeServerOptions: {
    // for android you should use your local ip address here
    host: 'localhost',
    port: 7007,
  },

  docs: {
    autodocs: 'tag',
  },
};

export default main;
```

Add a `preview.tsx`

```tsx
// .storybook-web/preview.tsx
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
export default preview;
```

In your `.storybook/index.tsx` file where you call `view.getStorybookUI` make sure you enable Web sockets and match the host and port config from your `.storybook-web/main.ts`.

```tsx
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,
  host: 'localhost',
  port: 7007,
});

export default StorybookUIRoot;
```

Now just make sure you run `storybook:web` before running your React Native Storybook and you should be able to sync up your stories between web and your mobile devices.

## 6.5.x to 7.6.x with storiesOf support

Storybook v7 doesn't support storiesOf in the same way as v6, but there is a compatibility mode that allows you to continue using storiesOf whilst you migrate your stories.

> [!WARNING]
> By opting into this compatibility mode you will lose out on some features of v7. We highly recommend moving to CSF stories.
>
> StoriesOf will be removed in v8 along with knobs and testing on those deprecated features will be limited.

### Update dependencies

Update all storybook dependencies to 7.6.10 or newer.

For example you may end up with something like this

```json
{
  "@storybook/react-native": "^7.6.10",
  "@storybook/addon-ondevice-actions": "^7.6.10",
  "@storybook/addon-ondevice-backgrounds": "^7.6.10",
  "@storybook/addon-ondevice-controls": "^7.6.10",
  "@storybook/addon-ondevice-notes": "^7.6.10"
}
```

### Update your package.json scripts

To opt in you can pass --v6-store to sb-rn-get-stories in the generate script.

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories --v6-store"
  }
}
```

You should also now import storiesOf from `@storybook/react-native/V6` this is necessary so that certain code paths don't run in v7 mode.

### Regenerate your requires file

Now that you've updated the script you can regenerate your `storybook.requires.js` file by running `yarn storybook-generate`.

It should now have the updated `@storybook/react-native/V6` import in it.

### Update `.storybook/index.js`

Update the import in `.storybook/index.js` from `@storybook/react-native` to `@storybook/react-native/V6`. You can also change this file to be called `.storybook/index.tsx`.

You should also make sure to add the storage prop to the getStorybookUI call. This lets you opt into using a different storage solution like mmkv or if you put async storage there it will continue to work as it did before.

```tsx
// .storybook/index.tsx
import './storybook.requires';
import { getStorybookUI } from '@storybook/react-native/V6';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

### Update your stories

Where ever you use storiesOf you should now import it from `@storybook/react-native/V6`.

```tsx
import { storiesOf } from '@storybook/react-native/V6';
import { text } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import React from 'react';
import { Button } from './AnotherButton';

storiesOf('Another Button', module)
  .addDecorator(withKnobs)
  .add('another button example', () => <Button text={text('text', 'test2')} onPress={() => null} />)
  .add('again', () => <Button text={text('text', 'text2')} onPress={() => null} />);
```

### Types

If you're using typescript you may notice that for v7 we've removed the types in `@storybook/react-native`. Thats part of an effort to re-use more code, you should now import them from `@storybook/react` instead.

## From version 5.3.x to 6.5.x

### Additional dependencies

To make storybook more compatible with core storybook libraries we are using some new dependencies. You will need to add these to your project.

```sh
yarn add -D @storybook/react-native @storybook/core-common @react-native-async-storage/async-storage react-native-safe-area-context react-dom
```

#### Controls (the new knobs)

To use the controls addon you will need these dependencies

```sh
yarn add -D @storybook/addon-ondevice-controls @storybook/addons @storybook/addon-controls @react-native-community/datetimepicker @react-native-community/slider
```

#### Actions

To use the actions addon you will need these dependencies

```sh
yarn add -D @storybook/addon-ondevice-actions @storybook/addon-actions
```

### `.storybook` folder

Rename the storybook folder to `.storybook`

### Update your `index.js` file

In 6.5 we use a script to generate your imports for stories and addons. This uses the new `main.js` file to generate the `storybook.requires.js` file. This file is then imported into the `index.js` file.

Remove the configure call, story imports and addon imports and reduce the index file to have this content. The most important thing is to import the `storybook.requires` file.

Also if your Storybook folder is called `storybook` you should change it to `.storybook` .

```js
// .storybook/index.js
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  // options go here
});

export default StorybookUI;
```

### Add a `main.js` and `preview.js`

In your `.storybook` folder add the `main.js` and `preview.js` files.

In the stories field of your `main.js` file update the regex to work for your project.

In the addons field list the addons you want to use, these must be compatible with React Native Storybook. Addons made for React Native are usually prefixed with `addon-ondevice`.

```jsx
// .storybook/main.js
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
  ],
};
```

Move any global decorators and parameters your have to `preview.js` , if you don’t have any then just export an empty array for decorators and an empty object for parameters.

```jsx
// .storybook/preview.js
import { View } from 'react-native';

export const decorators = [
  // Using a decorator to apply padding for every story
  (StoryFn) => (
    <View style={{ flex: 1, padding: 8 }}>
      <StoryFn />
    </View>
  ),
];

export const parameters = {
  my_param: 'anything',
};
```

### Scripts in package.json

In storybook 6.5 there are some new binaries that generate your story imports and one that watches for new files.

You can add these scripts to your package.json file.

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories",
    "storybook-watch": "sb-rn-watcher"
  }
}
```

You'll want to run the generate script whenever you add a new story file. Alternatively you can keep the watcher running.

There are some options you can pass to the both these scripts. You can see them by running `yarn  sb-rn-get-stories --help` and `sb-rn-watcher --help`.

```
  .description('Getter and watcher for react native storybook')
  .option(
    '-c, --config-path <path>',
    'The path to your config folder relative to your project-dir',
    './.storybook'
  )
  .option('-a, --absolute', 'Use absolute paths for story imports');
```

### Update your metro config

We use the sbmodern resolver field in order to resolve the modern version of storybook packages. Doing this removes the polyfills that ship in commonjs modules and fixes multiple long standing issues such as the promises never resolving bug and more (caused by corejs promises polyfill).

**Expo**

First create metro config file if you don't have it yet.

```sh
npx expo customize metro.config.js
```

Then add sbmodern to the start of the `resolver.resolverMainFields` list.

```diff
// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

--module.exports = getDefaultConfig(__dirname);
++const defaultConfig = getDefaultConfig(__dirname);

++defaultConfig.resolver.resolverMainFields.unshift('sbmodern');

++module.exports = defaultConfig;
```

**React native**

```js
module.exports = {
  /* existing config */
  resolver: {
    resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
  },
};
```

### Convert your stories to CSF

Whilst storiesOf will still work it is now deprecated so we recommend that you convert your stories to CSF.

There is a codemod for your convenience which should automatically make the code changes for you (make sure to update the glob to fit your files):

```sh
npx storybook@next migrate storiesof-to-csf --glob="src/**/*.stories.tsx"
```

Replace the storiesOf API with a default export that defines the title and component of your stories. Replace the add method with named exports that define each story. If you have any parameters or decorators, you can add them to the default export or to stories.

```jsx
// Before
storiesOf('Button', module)
  .addParameters({ myParam: "anything" })
  .addDecorator((Story)=> <Wrapper>{Story}</Wrapper>)
  .add('primary', () => <Button primary label="Button" />)
  .add('secondary', () => <Button label="Button" />);

// After
export default {
  title: 'Button',
  component: Button,

  // for all stories in this file
  parameters: {  myParam: "anything" },
};

export const Primary = { args: { primary: true, label: "button" } };

export const Secondary = {
  // this gives the property "label" the default value "button"
  args: { label: "button" }

  // for just this story
  decorators: [(Story) => (<Wrapper><Story/></Wrapper>)],
  parameters: {myParam: "something else"}
};

```

### Theming

The theme structure in Storybook 6.5 provides much more granular control over
more of the Storybook UI, including addons, this unfortunately makes it
difficult to provide backwards compatibility. If you were previously using a
custom theme you will now need to migrate it to the new theme.

The themeable values are comprehensively listed in the `Theme` type in
[theme.ts](https://github.com/storybookjs/react-native/blob/next-6.0/app/react-native/src/preview/components/Shared/theme.ts).

Below the old theme keys are listed against a comparable key in the new theme,
although bear in mind that there are many more aspects of the UI that can be
themed now, this is just to help get you started:

- `backgroundColor`: `backgroundColor`
- `storyListBackgroundColor`: `panel.backgroundColor`
- `listItemTextColor`: `storyList.storyTextColor`
- `listItemActiveColor`: `storyList.storySelectedBackgroundColor`
- `listItemActiveTextColor`: `storyList.storySelectedTextColor`
- `headerTextColor`: `storyList.headerTextColor`
- `labelColor`: `inputs.labelTextColor`
- `borderColor`: `panel.borderColor`, `navigation.borderColor`, `inputs.text.borderColor`, `inputs.radio.borderColor`, `inputs.swatch.borderColor`
- `previewBorderColor`: The preview no longer has a border and uses an elevation shadow instead
- `buttonTextColor`: `tabs.inactiveTextColor`, `button.primary.textColor`, `button.secondary.textColor`
- `buttonActiveTextColor`: `tabs.activeTextColor`
- `secondaryLabelColor`: `inputs.slider.valueTextColor`

### Test ids for tabs

The tabs were renamed to Sidebar, Canvas and Addons. So the test ids for the tabs are now:

BottomMenu.Sidebar, BottomMenu.Canvas, BottomMenu.Addons

And their text was updated to SIDEBAR, CANVAS, ADDONS.

### The server

The server is a package called `@storybook/react-native-server` and its an optional companion app that lets you control the React Native Storybook UI thats on your device via a web UI.

In this version the configuration for that was changes slightly.

Now to configure the server you'll add a `.storybook_server` folder with a `main.js`. In this file you should put the same stories regex that you have in your `.storybook/main.js` file.

```jsx
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  env: () => ({}),
  addons: ['@storybook/addon-essentials'],
};
```

Then in `package.json` you'll need a new script

```json
"start-server": "react-native-storybook-server"
```

For more information about this please read this [blog post](https://dev.to/dannyhw/quick-guide-for-storybookreact-native-server-v6-4nl2).
