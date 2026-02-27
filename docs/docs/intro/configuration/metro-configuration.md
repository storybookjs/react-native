---
sidebar_position: 3
---

# Metro Configuration

The `withStorybook` function is a Metro configuration wrapper that enables Storybook functionality in your React Native app. It handles automatic story discovery, file generation, and optional WebSocket server setup.

## Basic Setup

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

The wrapper works with sensible defaults, so you can use it without any options.

## Configuration Options

### Complete Options Reference

```js
module.exports = withStorybook(config, {
  // Enable/disable Storybook functionality - defaults to true
  enabled: true,

  // Path to your Storybook configuration folder - defaults to './.rnstorybook'
  configPath: './.rnstorybook',

  // Use JavaScript instead of TypeScript for generated files - defaults to false
  useJs: false,

  // Include doc tools for automatic args - defaults to true
  docTools: true,

  // Use lite mode (mocks out default Storybook UI dependencies) - defaults to false
  liteMode: false,

  // WebSocket server configuration - defaults to undefined
  // Use 'auto' to detect LAN IP and inject host/port into storybook.requires
  // You can also use { host, port }. 'auto' is available from v10.2.
  websockets: 'auto',

  // Enable experimental MCP endpoint (/mcp) - defaults to false
  experimental_mcp: false,
});
```

### Option Details

#### `enabled` (boolean)

- **Default**: `true`
- **Purpose**: Controls whether Storybook is included in your app bundle
- **Behavior**:
  - When `true`: Enables Storybook metro configuration and generates `storybook.requires` file
  - When `false`: Removes all Storybook code from the bundle by replacing imports with empty modules

#### `configPath` (string)

- **Default**: `'./.rnstorybook'`
- **Purpose**: Path to your Storybook configuration directory
- **Example**: `'./storybook'` or `'./src/.storybook'`

#### `useJs` (boolean)

- **Default**: `false`
- **Purpose**: Generate JavaScript files instead of TypeScript
- **Note**: Useful for projects not using TypeScript. Generates `storybook.requires.js` instead of `storybook.requires.ts`

#### `docTools` (boolean)

- **Default**: `true`
- **Purpose**: Include utilities for automatic arg extraction
- **Related**: Works with `babel-plugin-react-docgen-typescript`

#### `liteMode` (boolean)

- **Default**: `false`
- **Purpose**: Use lite mode to reduce bundle size by mocking out the default Storybook UI
- **Benefits**: Removes dependencies like react-native-reanimated, reducing app bundle size
- **Note**: Only affects the on-device UI components from `@storybook/react-native-ui`

Use this when using @storybook/react-native-ui-lite instead of @storybook/react-native-ui.

#### `websockets` (`'auto' | object`)

- **Default**: `undefined`
- **Purpose**: Configure WebSocket server for remote control
- **Properties**:
  - `port`: WebSocket server port number
  - `host`: WebSocket server hostname
- **Manual mode**:
  - You can always pass `{ host, port }` explicitly.
- **Special value**:
  - `'auto'`: Detects LAN IP automatically and injects host/port into generated `storybook.requires` (available from `v10.2`)
- **Requirements**: Make sure you use the same port in the getStorybookUI configuration. On android you must use your machine's IP address instead of `localhost` if running on a physical device.

#### `experimental_mcp` (boolean)

- **Default**: `false`
- **Purpose**: Enables an experimental MCP (Model Context Protocol) endpoint at `/mcp` on the Storybook channel server
- **Available from**: `v10.3`
- **Behavior**:
  - Can run without websockets for MCP documentation/query tooling
  - Story selection MCP tools require `websockets` to be enabled
- **Related**: See [MCP Configuration](./mcp-configuration.md)

## How It Works

### File Generation

The wrapper automatically generates `storybook.requires.ts` (or `.js`) containing:

1. **Story imports** - Based on patterns in your `main.ts`
2. **Addon registration** - Loads configured addons
3. **Preview configuration** - Applies global decorators and parameters
4. **Hot module reloading** - Automatic updates when stories change

### Custom Resolver

The wrapper modifies Metro's resolver to:

- Enable package exports for Storybook packages since its a esm based package
- Handle platform-specific modules (like `uuid`)
- Filter out template files from story loading which can cause metro to crash

## Production Builds

### Removing Storybook from Production

For production builds, you can completely remove Storybook code by setting `enabled: false`:

```js
// metro.config.js
const STORYBOOK_ENABLED = process.env.STORYBOOK_ENABLED === 'true';

module.exports = withStorybook(config, {
  enabled: STORYBOOK_ENABLED,
});
```

When storybook is disabled the withStorybook wrapper will:

- Replace all `@storybook/*` and `storybook/*` imports with empty modules
- Stub out your Storybook config directory imports

Note that if you try to render Storybook when it is disabled you will get a blank screen with a warning message.

If you want to conditionally swap between your app and Storybook you can use the following pattern:

```tsx
// App.tsx
import { AppRegistry } from 'react-native';

let AppEntryPoint = App;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
```

Or alternatively put storybook in its own screen that you can only access when Storybook is enabled.

## Troubleshooting

### Common Issues

1. **Stories not found**
   - Verify `configPath` points to correct directory
   - Check story patterns in `main.ts`
   - Ensure Metro cache is cleared: `npx react-native start --reset-cache`

2. **WebSocket connection failed**
   - Check if port is already in use
   - Verify `host` matches your development setup
   - verify that host and port match in both the `withStorybook` configuration and the `getStorybookUI` call in your app code
   - For physical devices, use machine's IP instead of `localhost`

3. **Production bundle includes Storybook**
   - Set `enabled: false` in your metro config
   - Conditionally import Storybook UI in your app code based on environment variables
