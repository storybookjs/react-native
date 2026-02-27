---
sidebar_position: 3
---

# Re.Pack Setup

This guide covers setting up Storybook with [Re.Pack](https://re-pack.dev/) projects that use Rspack or Webpack instead of Metro as the bundler.

For a ready-to-go starter project, check out the [RepackStorybookStarter](https://github.com/dannyhw/RepackStorybookStarter) repository.

## Installation

Use the Storybook CLI to initialize your project:

```bash
npm create storybook -- --type react_native --yes
```

## Install Reanimated and Worklets

Storybook's default UI requires `react-native-reanimated` and `react-native-worklets`:

```bash
npm install react-native-reanimated react-native-worklets
```

Then ensure the worklets babel plugin is in `babel.config.js`. It **must** be the last plugin in the list:

```js
// babel.config.js
module.exports = {
  presets: [
    // your existing preset, e.g.:
    'module:@react-native/babel-preset',
  ],
  plugins: [
    // ... any other plugins
    'react-native-worklets/plugin', // must be last
  ],
};
```

## Configure Rspack/Webpack

Instead of wrapping Metro with `withStorybook`, add the `StorybookPlugin` to your rspack/webpack config plugins array.

Use an environment variable (`STORYBOOK_ENABLED`) to control both the plugin behavior and a build-time constant for your app code:

```js
// rspack.config.mjs
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import { StorybookPlugin } from '@storybook/react-native/repack/withStorybook';

const storybookEnabled = process.env.STORYBOOK_ENABLED === 'true';

export default Repack.defineRspackConfig({
  // ... your existing config
  resolve: {
    ...Repack.getResolveOptions({
      enablePackageExports: true, // required for storybook package resolution
    }),
  },
  plugins: [
    new Repack.RepackPlugin(),
    new rspack.DefinePlugin({
      STORYBOOK_ENABLED: JSON.stringify(storybookEnabled),
    }),
    new StorybookPlugin({
      enabled: storybookEnabled,
      websockets: 'auto',
    }),
    // ... your other plugins
  ],
});
```

:::warning Important
`enablePackageExports: true` is required so rspack can correctly resolve Storybook's package exports (e.g. `@storybook/react-native/preview`). Without it, imports from Storybook packages will fail.
:::

:::info
Unlike the Metro setup, there is no need to configure `require.context` support — rspack handles it natively.
:::

## Create Entrypoint

Conditionally render Storybook based on the `STORYBOOK_ENABLED` build-time constant. Since `StorybookPlugin` replaces Storybook imports with empty modules when disabled, you can import Storybook at the top level safely:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';

declare const STORYBOOK_ENABLED: boolean;

export default function App() {
  if (STORYBOOK_ENABLED) {
    return <StorybookUI />;
  }

  // Your existing app code here
  return (
    // ...
  );
}
```

The `declare const` tells TypeScript about the global that rspack's `DefinePlugin` injects. When `STORYBOOK_ENABLED` is `false`, rspack dead-code-eliminates the Storybook branch entirely.

## Add Scripts

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED='true' react-native start",
    "storybook:ios": "STORYBOOK_ENABLED='true' react-native run-ios",
    "storybook:android": "STORYBOOK_ENABLED='true' react-native run-android"
  }
}
```

Replace `react-native` with `rock` if your project uses Rock CLI.

## Run

```bash
npm run storybook
```

## StorybookPlugin Options

| Option             | Type               | Default            | Description                                                       |
| ------------------ | ------------------ | ------------------ | ----------------------------------------------------------------- |
| `enabled`          | `boolean`          | `true`             | Strip Storybook from bundle when `false`                          |
| `configPath`       | `string`           | `'./.rnstorybook'` | Storybook config directory                                        |
| `useJs`            | `boolean`          | `false`            | Generate `.js` instead of `.ts`                                   |
| `docTools`         | `boolean`          | `true`             | Auto arg extraction                                               |
| `liteMode`         | `boolean`          | `false`            | Mock default UI deps (use with `@storybook/react-native-ui-lite`) |
| `websockets`       | `'auto' \| object` | `undefined`        | `'auto'` detects LAN IP, or `{ port: 7007, host: 'localhost' }`   |
| `experimental_mcp` | `boolean`          | `false`            | Enable experimental MCP endpoint (`/mcp`) for AI tooling (v10.3+) |
