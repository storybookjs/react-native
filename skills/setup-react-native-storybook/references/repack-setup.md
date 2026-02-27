# Re.Pack (Rspack/Webpack) Setup

For React Native projects using [Re.Pack](https://re-pack.dev/) instead of Metro as the bundler.

## Step 1: Run CLI Init

```bash
npm create storybook -- --type react_native --yes
```

## Step 2: Install react-native-reanimated and react-native-worklets

Storybook's default UI requires both `react-native-reanimated` and `react-native-worklets`. Re.Pack projects often already have `react-native-reanimated` but **`react-native-worklets` must also be installed separately** — it is not bundled with reanimated:

```bash
npm install react-native-reanimated react-native-worklets
```

Verify both are in `package.json` dependencies before proceeding.

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

## Step 3: Configure the Rspack/Webpack Config

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

**Important:** `enablePackageExports: true` is required so rspack can correctly resolve Storybook's package exports (e.g. `@storybook/react-native/preview`). Without it, imports from Storybook packages will fail.

**Note:** Unlike the Metro setup, there is no need to configure `require.context` support — rspack handles it natively.

## Step 4: Create Entrypoint

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

## Step 5: Add Scripts

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED='true' rock start",
    "storybook:ios": "STORYBOOK_ENABLED='true' rock run:ios",
    "storybook:android": "STORYBOOK_ENABLED='true' rock run:android"
  }
}
```

Replace `rock` with `react-native` or your project's CLI if not using Rock.

## Step 6: Run

```bash
npm run storybook
```

## StorybookPlugin Options

```js
new StorybookPlugin({
  enabled: true, // Strip Storybook from bundle when false
  configPath: './.rnstorybook', // Storybook config directory
  useJs: false, // Generate .js instead of .ts
  docTools: true, // Auto arg extraction
  liteMode: false, // Mock default UI deps (use with react-native-ui-lite)
  websockets: 'auto', // 'auto' detects LAN IP, or { port: 7007, host: 'localhost' }
});
```
