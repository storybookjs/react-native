---
sidebar_position: 3
---

# Re.Pack Setup

This guide covers what's different when using [Re.Pack](https://re-pack.dev/) (Rspack/Webpack) instead of Metro. The Storybook configuration (`.rnstorybook` folder, stories, addons) is identical regardless of bundler, only the bundler config itself changes.

For a ready-to-go starter project, check out the [RepackStorybookStarter](https://github.com/dannyhw/RepackStorybookStarter) repository.

## Entry-point swapping (recommended)

The bundler-agnostic `withStorybook` wrapper auto-detects Re.Pack and handles everything — entry-point swapping, story generation, and WebSocket setup. Follow the standard [Getting Started guide](./index.md) for the full walkthrough; the only difference is your bundler config file:

```js
// rspack.config.mjs
import * as Repack from '@callstack/repack';
import { withStorybook } from '@storybook/react-native/withStorybook';

export default withStorybook(
  Repack.defineRspackConfig({
    // ... your existing config
    resolve: {
      ...Repack.getResolveOptions({
        enablePackageExports: true, // required for Storybook package resolution
      }),
    },
    plugins: [new Repack.RepackPlugin()],
  })
);
```

Then run with `STORYBOOK_ENABLED=true` as described in the Getting Started guide. No changes to `App.tsx` needed.

:::warning
`enablePackageExports: true` is required so Rspack can correctly resolve Storybook's package exports. Without it, imports from Storybook packages will fail.
:::

## In-app integration (StorybookPlugin)

If you prefer to render Storybook inside your app rather than using entry-point swapping, use the `StorybookPlugin` directly. This is the Re.Pack equivalent of the Metro-specific `withStorybook` wrapper described in the [Manual Setup](./manual-setup.md) guide.

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
      enablePackageExports: true,
    }),
  },
  plugins: [
    new Repack.RepackPlugin(),
    new rspack.DefinePlugin({
      STORYBOOK_ENABLED: JSON.stringify(storybookEnabled),
    }),
    new StorybookPlugin({
      enabled: storybookEnabled,
    }),
  ],
});
```

Then conditionally render Storybook in your app using the build-time constant:

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';

declare const STORYBOOK_ENABLED: boolean;

export default function App() {
  if (STORYBOOK_ENABLED) {
    return <StorybookUI />;
  }

  return (
    // ... your existing app
  );
}
```

The `declare const` tells TypeScript about the global that Rspack's `DefinePlugin` injects. When `STORYBOOK_ENABLED` is `false`, Rspack dead-code-eliminates the Storybook branch entirely.

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

## Re.Pack notes

- Unlike Metro, there is no need to configure `require.context` support — Rspack handles it natively.
- Replace `react-native` with `rock` in your scripts if your project uses Rock CLI.

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
