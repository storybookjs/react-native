---
sidebar_position: 3
---

# Configuration

This page covers the essential setup and links to detailed guides for advanced features.

## Configuration Overview

The storybook configuration consists of several key files:

- `main.ts`: Main configuration file for story discovery and addons
- `preview.tsx`: Configures the story rendering environment and global parameters
- `index.tsx`: Entry point for the Storybook UI and runtime behavior
- `storybook.requires.ts`: Automatically generated file containing story imports and addon registrations

### main.ts

The `main.ts` file is your primary configuration entry point, located in the `.storybook` directory.

```typescript
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    // Simple glob pattern
    '../components/**/*.stories.?(ts|tsx|js|jsx)',

    // Directory configuration with title prefix
    {
      directory: '../packages/ui',
      titlePrefix: 'UI',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
    },
  ],

  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
  ],
};

export default main;
```

### Options

- `stories`: Array of story patterns or configuration objects
  - `directory`: Base directory for stories
  - `titlePrefix`: Optional prefix for story titles
  - `files`: Glob pattern for story files
- `addons`: Array of addon packages to include
- `features`: Enable new functionality (see [Feature Flags](./feature-flags.md))

## preview.tsx

The `preview.tsx` file configures the story rendering environment and global parameters.

```typescript
import { Preview } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  decorators: [
    // backgrounds addon decorator
    withBackgrounds,
  ],

  parameters: {
    // story sorting configuration, should only be configured in preview file.
    options: {
      storySort: {
        method: 'alphabetical',
        includeNames: true,
        order: ['Components', 'Examples'],
      },
    },

    // UI Configuration
    hideFullScreenButton: false,
    noSafeArea: false,
    storybookUIVisibility: 'visible', // 'visible' | 'hidden'
    layout: 'padded', // 'fullscreen' | 'centered' | 'padded'

    // Background Configuration
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'white' },
        { name: 'dark', value: '#333' },
      ],
    },

    // your own parameters
    my_param: 'anything',
  },
};

export default preview;
```

### Notable Parameters

Other than story sort the other parameters can be overwritten per story.

- `parameters.options.storySort`: Story sorting configuration
- `parameters.hideFullScreenButton`: Toggle fullscreen button visibility
- `parameters.noSafeArea`: Disable safe area insets
- `parameters.storybookUIVisibility`: Controls UI visibility (`'visible'` | `'hidden'`)
- `parameters.layout`: Controls story container layout (`'fullscreen'` | `'centered'` | `'padded'`)
- `parameters.backgrounds`: Background addon configuration

## index.tsx

The entry point file configures the Storybook UI and runtime behavior.

```typescript
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  // UI Configuration
  onDeviceUI: true,
  shouldPersistSelection: true,

  // Theme Customization
  theme: {
    // theme documentation coming soon, for now use types to understand the available options
  },

  // Story Selection
  initialSelection: {
    kind: 'Components/Button',
    name: 'Primary',
  },

  // Storage Configuration
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },

  // Websocket Options
  enableWebsockets: false,
  host: 'localhost',
  port: 7007,

  // CustomUIComponent: MyCustomUI, // Optional custom UI component
});

export default StorybookUIRoot;
```

#### Available Options

- **UI Options**
  - `onDeviceUI`: Enable/disable on-device UI (default: true)
  - `shouldPersistSelection`: Persist last viewed story (default: true)

- **Theme Options**
  - `theme`: Customize UI theme and branding

- **Story Selection**
  - `initialSelection`: Set initial story to display
    - String format: `'kind--story'`
    - Object format: `{ kind: string, name: string }`

- **Storage Options**
  - `storage`: Implementation for story persistence
    - `getItem`: Function to retrieve stored values
    - `setItem`: Function to store values

- **Websocket Options**
  - `enableWebsockets`: Enable remote control (default: false)
  - `host`: Websocket host (default: 'localhost')
  - `port`: Websocket port (default: 7007)

- **Custom UI Options**
  - `CustomUIComponent`: Replace the default Storybook UI with your own implementation

## Metro Configuration

Wrap your Metro config with the `withStorybook` function:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);
module.exports = withStorybook(config);
```

For detailed Metro configuration options, see the [Metro Configuration guide](./metro-configuration.md).

## Generated Files

### storybook.requires.ts

This file is automatically generated by the Metro bundler or CLI. It contains:

- Story imports based on patterns in `main.ts`
- Addon registrations
- Preview configuration
- Hot module reloading setup

**Important**: Never edit this file manually - it's regenerated automatically.

## Advanced Configuration

For more complex setups and advanced features, see these detailed guides:

### [Metro Configuration](./metro-configuration.md)

Configure the `withStorybook` Metro wrapper for automatic story discovery, file generation, WebSocket setup, and production builds.

### [Storybook UI Configuration](./storybook-ui-configuration.md)

Configure the `getStorybookUI` function to customize the appearance and behavior of Storybook in your app, including themes and storage.

### [CLI Configuration](./cli-configuration.md)

Use the `sb-rn-get-stories` command and understand all available CLI options for story generation and doc tools.

### [Feature Flags](./feature-flags.md)

Opt into new functionality via the `features` config in `main.ts`. Flags let you adopt new APIs at your own pace — they will become the default in the next major version.

### [Backgrounds](./backgrounds.md)

The new globals-based backgrounds API with full-screen support, available now behind a feature flag.

### [WebSocket Configuration](./websocket-configuration.md)

Enable remote control of Storybook from external tools, browsers, or other devices for testing and automation.

### [MCP Configuration](./mcp-configuration.md)

Enable the experimental MCP endpoint (`/mcp`) for AI tooling to query Storybook docs and metadata (available from v10.3).
