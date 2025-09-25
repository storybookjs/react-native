---
sidebar_position: 3
---

# Metro Configuration

The `withStorybook` function is a Metro configuration wrapper that enables Storybook functionality in your React Native app. It handles automatic story discovery, file generation, and optional WebSocket server setup.

## Basic Setup

```js
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

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

  // Remove Storybook from bundle when the enabled flag is false
  onDisabledRemoveStorybook: false,

  // Include doc tools for automatic args - defaults to true
  docTools: true,

  // WebSocket server configuration - defaults to undefined
  websockets: {
    port: 7007,
    host: 'localhost',
  },
});
```

### Option Details

#### `enabled` (boolean)

- **Default**: `true`
- **Purpose**: Controls whether Storybook specific metro configuration is applied
- **Behavior**: When `false`, prevents generation of `storybook.requires` file and disabled storybook specific metro resolver logic

#### `configPath` (string)

- **Default**: `'./.rnstorybook'`
- **Purpose**: Path to your Storybook configuration directory
- **Example**: `'./storybook'` or `'./src/.storybook'`

#### `useJs` (boolean)

- **Default**: `false`
- **Purpose**: Generate JavaScript files instead of TypeScript
- **Note**: Useful for projects not using TypeScript

#### `onDisabledRemoveStorybook` (boolean)

- **Default**: `false`
- **Purpose**: Completely remove Storybook code from production bundles when `enabled` is set to `false`
- **Requirements**: Must be used with `enabled: false` to take effect, also make sure you don't attempt to import Storybook in your app code when disabled

#### `docTools` (boolean)

- **Default**: `true`
- **Purpose**: Include utilities for automatic arg extraction
- **Related**: Works with `babel-plugin-react-docgen-typescript`

#### `websockets` (object)

- **Default**: `{ port: 7007, host: 'localhost' }`
- **Purpose**: Configure WebSocket server for remote control
- **Properties**:
  - `port`: WebSocket server port number
  - `host`: WebSocket server hostname
- **Requirements**: Make sure you use the same port in the getStorybookUI configuration. On android you must use your machine's IP address instead of `localhost` if running on a physical device.

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

For production builds, completely remove Storybook code:

```js
// metro.config.js
const STORYBOOK_ENABLED = process.env.STORYBOOK_ENABLED === 'true';

module.exports = withStorybook(config, {
  enabled: STORYBOOK_ENABLED,
  onDisabledRemoveStorybook: true,
});
```

Should be used in conjunction with excluding Storybook imports in your app code otherwise metro could crash:

```tsx
// App.tsx
import { AppRegistry } from 'react-native';

let AppEntryPoint = App;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
```

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
   - Ensure both `enabled: false` and `onDisabledRemoveStorybook: true`
   - Conditionally import Storybook UI in your app code
