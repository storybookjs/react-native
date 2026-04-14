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
- 🏁 [Feature Flags](#feature-flags)
- 🧪 [Using stories in unit tests](#using-stories-in-unit-tests)
- 🤝 [Contributing](#contributing)
- ✨ [Examples](#examples)- [Storybook for React Native](#storybook-for-react-native)
- 🤖 [Agent skills](#agent-skills)

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

Then wrap your bundler config with the `withStorybook` function. It auto-detects Metro vs Re.Pack and handles everything — entry-point swapping, story generation, and optional WebSocket setup.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

No changes to `App.tsx` are needed. Set `STORYBOOK_ENABLED=true` and run:

```sh
STORYBOOK_ENABLED=true expo start
```

The wrapper automatically swaps your app's entry point with Storybook's entry point. When the variable is not set, your app runs normally with zero Storybook code in the bundle.

If you want to add everything yourself check out the [manual setup guide](https://storybookjs.github.io/react-native/docs/intro/getting-started/manual-setup).

#### Reanimated setup

Make sure you have `react-native-reanimated` in your project and the plugin setup in your babel config.

```js
// babel.config.js
plugins: ['react-native-reanimated/plugin'],
```

## Re.Pack setup

For projects using [Re.Pack](https://re-pack.dev/) (Rspack/Webpack) instead of Metro, see the full [Re.Pack Setup guide](https://storybookjs.github.io/react-native/docs/intro/getting-started/repack). You can also reference the [RepackStorybookStarter](https://github.com/dannyhw/RepackStorybookStarter) project.

## Expo router specific setup

For Expo Router projects, you can either use entry-point swapping (recommended) or create a dedicated Storybook route.

See the full [Expo Router Setup guide](https://storybookjs.github.io/react-native/docs/intro/getting-started/expo-router) for details.

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
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
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

Install each one you want to use and add them to the `deviceAddons` list in your `main.ts`:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // ... rest of config
  deviceAddons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

export default main;
```

> [!NOTE]
> `deviceAddons` ensures on-device addons are only loaded at runtime on the device, avoiding errors during server-side operations. For backwards compatibility, listing them in `addons` still works.

### Using the addons in your story

For details of each ondevice addon you can see the readme:

- [actions](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-actions#readme)
- [backgrounds](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-backgrounds#readme)
- [controls](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-controls#readme)
- [notes](https://github.com/storybookjs/react-native/tree/next/packages/ondevice-notes#readme)

## Hide/Show storybook

Starting with v10.4, entry-point swapping is the default setup. Your existing in-app integration setup continues to work and is fully supported, but entry-point swapping is the recommended approach for new projects.

### Entry-point swapping (recommended, v10.4+)

When using the bundler-agnostic `withStorybook` wrapper, set `STORYBOOK_ENABLED=true` to run Storybook. The wrapper swaps your app's entry point with Storybook's entry point automatically. When the variable is not set, your app runs normally with zero Storybook code in the bundle.

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true expo start",
    "storybook:ios": "STORYBOOK_ENABLED=true expo start --ios"
  }
}
```

### Expo Router

Create a dedicated route for Storybook:

```tsx
// app/storybook.tsx
export { default } from '../.rnstorybook';
```

Then navigate to `/storybook` in your app to view stories.

### In-app integration (fully supported)

You can also import Storybook directly in your `App.tsx`. This approach continues to work and is fully supported:

```tsx
import StorybookUI from './.rnstorybook';
import { MyApp } from './MyApp';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  return isStorybook ? <StorybookUI /> : <MyApp />;
}
```

## withStorybook wrapper

`withStorybook` is a bundler-agnostic wrapper that configures your project for Storybook. It auto-detects whether you're using Metro or Re.Pack and handles entry-point swapping, story generation, and WebSocket setup.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig);
```

When `STORYBOOK_ENABLED=true` is set, the wrapper activates. When it's not set, the wrapper is a no-op and your app runs normally.

### Options

Options can be passed as a second argument. Most settings can also be controlled via environment variables (see [Environment Variables](https://storybookjs.github.io/react-native/docs/intro/configuration/environment-variables)).

#### configPath

Type: `string`, default: `path.resolve(process.cwd(), './.rnstorybook')`

The location of your Storybook configuration directory, which includes `main.ts` and other project-related files.

#### useJs

Type: `boolean`, default: `false`

Generates the `.rnstorybook/storybook.requires` file in JavaScript instead of TypeScript.

#### docTools

Type: `boolean`, default: `true`

Whether to include doc tools in the storybook.requires file. Doc tools provide additional documentation features and work with `babel-plugin-react-docgen-typescript`.

#### liteMode

Type: `boolean`, default: `false`

Whether to use lite mode for Storybook. In lite mode, the default Storybook UI is mocked out so you don't need to install all its dependencies like react-native-reanimated. This is useful for reducing bundle size and dependencies. Use this when using @storybook/react-native-ui-lite instead of @storybook/react-native-ui. Can also be set via `STORYBOOK_DISABLE_UI=true`.

#### experimental_mcp

Type: `boolean`, default: `false`

Enables an experimental MCP (Model Context Protocol) server for AI tooling to query Storybook documentation and component/story metadata.

The MCP server is available at the `/mcp` endpoint on the Storybook channel server. Configure your MCP client via its settings UI, or use:

```sh
npx mcp-add --type http --url "http://localhost:7007/mcp" --scope project
```

### websockets

Type: `'auto' | { host?: string, port?: number, secured?: boolean, key?: string | Buffer, cert?: string | Buffer, ca?: string | Buffer | Array<string | Buffer>, passphrase?: string }`, default: `undefined`

If specified, create a WebSocket server on startup. This allows you to sync up multiple devices to show the same story and [arg](https://storybook.js.org/docs/writing-stories/args) values connected to the story in the UI.

Use `'auto'` to automatically detect your LAN IP and inject host/port into the generated `storybook.requires` file. WebSocket settings can also be overridden via `STORYBOOK_WS_HOST`, `STORYBOOK_WS_PORT`, and `STORYBOOK_WS_SECURED` environment variables.

> **Note:** A Metro-specific `withStorybook` is also available at `@storybook/react-native/metro/withStorybook` for advanced Metro configuration. See the [Metro Configuration docs](https://storybookjs.github.io/react-native/docs/intro/configuration/metro-configuration) for details.

## getStorybookUI options

You can pass these parameters to getStorybookUI call in your storybook entry point:

```ts
{
    initialSelection?: string | Object;
    storage?: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
    };
    onDeviceUI?: boolean;
    shouldPersistSelection?: boolean;
    theme: Partial<Theme>;
}
```

> **Note:** WebSocket options (`enableWebsockets`, `host`, `port`, `secured`) are auto-injected when using the bundler-agnostic `withStorybook` wrapper. You only need to set them manually if you're using the Metro-specific wrapper or a custom setup.

## Feature Flags

Feature flags let you opt into new functionality without breaking existing behavior. In the next major version, the behavior behind these flags will become the default and the flags will no longer be needed.

Add them to the `features` object in `main.ts`:

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls'],
  features: {
    ondeviceBackgrounds: true,
  },
};

export default main;
```

| Flag                  | Description                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ondeviceBackgrounds` | New backgrounds API with globals-based configuration, full-screen support, and no extra package needed. Available from v10.3. |

For full documentation including configuration examples, see the [Feature Flags guide](https://storybookjs.github.io/react-native/docs/intro/configuration/feature-flags).

## Using stories in unit tests

Storybook provides testing utilities that allow you to reuse your stories in external test environments, such as Jest. This way you can write unit tests easier and reuse the setup which is already done in Storybook, but in your unit tests. You can find more information about it in the [portable stories section](./PORTABLE_STORIES.md).

## Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](CONTRIBUTING.md) to get started,
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
- Re.Pack setup https://github.com/dannyhw/RepackStorybookStarter
- Want to showcase your own project? open a PR and add it to the list!

## Agent skills

This repo includes agent skills for setting up and working with Storybook for React Native.

### Skills

- **writing-react-native-storybook-stories** - Guides Claude on writing stories using Component Story Format (CSF), including controls, addons, decorators, parameters, and portable stories
- **setup-react-native-storybook** - Guides Claude through adding Storybook to your project, covering Expo, Expo Router, React Native CLI, and Re.Pack setups
- **upgrading-react-native-storybook** - Guides Claude through incremental React Native Storybook upgrades, split by supported migration paths from 5.3.x through 10.x, including converting remaining `storiesOf` stories to CSF during the 6.5.x to 7.6.x migration

### Installation

#### Any AI agent or IDE (universal)

```sh
npx skills add storybookjs/react-native
```

This works with any agent harness that supports skills (Claude Code, Cursor, Windsurf, etc.).
