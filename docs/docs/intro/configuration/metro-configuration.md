---
sidebar_position: 3
---

# Metro Configuration

This page is the configuration reference for both `withStorybook` wrappers available for Metro projects. For initial setup, see [Getting Started](../getting-started/index.md) (entry-point swapping) or [Manual Setup](../getting-started/manual-setup.md) (in-app integration).

## Bundler-agnostic wrapper (recommended)

```js
const { withStorybook } = require('@storybook/react-native/withStorybook');
```

This is the recommended wrapper for new projects (v10.4+). It auto-detects Metro vs Re.Pack, performs entry-point swapping when `STORYBOOK_ENABLED=true` is set, and is a strict no-op otherwise — zero Storybook code in the bundle.

### Basic usage

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

Configuration is driven by environment variables. See [Environment Variables](./environment-variables.md) for the full reference.

### Options

The bundler-agnostic wrapper accepts an optional second argument for options that can't be expressed as env vars:

```js
module.exports = withStorybook(config, {
  configPath: './.rnstorybook', // Storybook config directory (default: './.rnstorybook')
  useJs: false, // Generate .js instead of .ts (default: false)
  docTools: true, // Auto arg extraction (default: true)
  websockets: 'auto', // 'auto' detects LAN IP, or { host, port }
  experimental_mcp: false, // Enable MCP endpoint at /mcp (default: false)
});
```

Environment variables (`STORYBOOK_ENABLED`, `STORYBOOK_WS_HOST`, etc.) always take precedence over options passed here.

## Metro-specific wrapper

```js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
```

Use this wrapper for [in-app integration](../getting-started/manual-setup.md) or when you need direct control over Metro behavior (e.g. the `enabled` option). This wrapper does **not** do entry-point swapping — your app remains the entry point and you control where Storybook renders.

### Basic usage

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

### Complete options reference

```js
module.exports = withStorybook(config, {
  enabled: true, // Include Storybook in the bundle (default: true)
  configPath: './.rnstorybook', // Storybook config directory (default: './.rnstorybook')
  useJs: false, // Generate .js instead of .ts (default: false)
  docTools: true, // Auto arg extraction (default: true)
  liteMode: false, // Mock default UI deps (default: false)
  websockets: 'auto', // WebSocket config (default: undefined)
  experimental_mcp: false, // Enable MCP endpoint (default: false)
});
```

### Option details

#### `enabled`

- **Default**: `true`
- Controls whether Storybook is included in your app bundle. When `false`, all `@storybook/*` and `storybook/*` imports are replaced with empty modules, and your Storybook config directory imports are stubbed out. If you try to render Storybook when disabled, you'll get a blank screen with a warning.

#### `configPath`

- **Default**: `'./.rnstorybook'`
- Path to your Storybook configuration directory (containing `main.ts`, `preview.tsx`, etc.).

#### `useJs`

- **Default**: `false`
- Generate `storybook.requires.js` instead of `storybook.requires.ts`. Useful for projects not using TypeScript.

#### `docTools`

- **Default**: `true`
- Include utilities for automatic arg extraction. Works with `babel-plugin-react-docgen-typescript`.

#### `liteMode`

- **Default**: `false`
- Mocks out the default Storybook UI dependencies (like `react-native-reanimated`), reducing bundle size. Use when pairing with `@storybook/react-native-ui-lite` instead of `@storybook/react-native-ui`.

#### `websockets`

- **Default**: `undefined` (disabled)
- Configure the WebSocket server for remote control and syncing.
- `'auto'`: Detects your LAN IP automatically and injects host/port into the generated `storybook.requires` file (available from v10.2).
- `{ host, port }`: Manual configuration. On Android physical devices, use your machine's IP instead of `localhost`.

#### `experimental_mcp`

- **Default**: `false`
- Enables an experimental MCP (Model Context Protocol) endpoint at `/mcp` on the Storybook channel server (available from v10.3). Story selection tools require `websockets` to be enabled. See [MCP Configuration](./mcp-configuration.md).

## How it works

Both wrappers modify your Metro config in the same way under the hood:

**File generation** — Automatically generates `storybook.requires.ts` (or `.js`) containing story imports, addon registration, preview configuration, and hot module reloading support.

**Custom resolver** — Enables package exports for Storybook's ESM-based packages, handles platform-specific modules (like `uuid`), filters out template files that can cause Metro to crash, and rewrites the CSF Next import `#.storybook/preview` to `{configPath}/preview` so the same story files work in RN-only and dual RN+RNW setups.

**Composition** — Both wrappers are composable with other config wrappers. Chain them like `withStorybook(withNativeWind(config))`. The order may matter depending on the other wrappers.

## Production builds

**Bundler-agnostic wrapper**: Storybook is automatically excluded when `STORYBOOK_ENABLED` is not set. Nothing to configure.

**Metro-specific wrapper**: Set `enabled: false` to strip all Storybook code:

```js
module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

## Storybook release builds on React Native CLI

Entry-point swapping happens in Metro's resolver, which the dev server uses to find the entry file. `react-native bundle` does not: it takes the entry file as given. Xcode and Gradle run `react-native bundle` for release builds, so in a React Native CLI project `STORYBOOK_ENABLED=true` alone produces a release build of your app, not of Storybook.

For those builds, also point the entry file at Storybook with `ENTRY_FILE`, relative to your project root:

```sh
# Android
cd android && STORYBOOK_ENABLED=true ENTRY_FILE=.rnstorybook/index.tsx ./gradlew assembleRelease

# iOS
STORYBOOK_ENABLED=true ENTRY_FILE=.rnstorybook/index.tsx npx react-native run-ios --mode Release

# Bundling directly
STORYBOOK_ENABLED=true npx react-native bundle --entry-file .rnstorybook/index.tsx --platform ios --dev false --bundle-output main.jsbundle
```

Keep `STORYBOOK_ENABLED=true` as well: it generates `storybook.requires` and applies the resolver settings Storybook needs. When building from the Xcode app rather than the command line, export both variables from `ios/.xcode.env.local`.

This only applies to React Native CLI release builds. The dev server (`react-native start`, debug builds) and Expo (`expo start`, `expo export`, EAS builds) swap the entry point on their own.

## Troubleshooting

**Stories not found** — Verify `configPath` points to the correct directory, check story patterns in `main.ts`, and clear the Metro cache: `npx react-native start --reset-cache` or `npx expo start --clear`.

**WebSocket connection failed** — Check if the port is already in use, verify the host matches your setup, and use your machine's IP instead of `localhost` for physical devices. With the bundler-agnostic wrapper, WebSocket settings are auto-injected; with the Metro-specific wrapper, ensure host/port match between `withStorybook` options and your `getStorybookUI` call.

**Release build shows the app instead of Storybook** — In React Native CLI projects, release builds need `ENTRY_FILE` as well as `STORYBOOK_ENABLED=true`. See [Storybook release builds on React Native CLI](#storybook-release-builds-on-react-native-cli).

**Production bundle includes Storybook** — With the bundler-agnostic wrapper, ensure you're not setting `STORYBOOK_ENABLED=true` in production builds. With the Metro-specific wrapper, set `enabled: false`.
