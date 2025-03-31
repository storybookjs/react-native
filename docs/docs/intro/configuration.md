---
sidebar_position: 3
---

# Configuration

## main.ts

The `main.ts` file is your primary configuration entry point, located in the `.storybook` directory.

```typescript
import { StorybookConfig } from '@storybook/react-native';

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
- `reactNative.playFn`: Enable/disable story play functions

## preview.tsx

The `preview.tsx` file configures the story rendering environment and global parameters.

```typescript
import { Preview } from '@storybook/react';
import { View } from 'react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  decorators: [
    // Global wrapper for all stories
    (Story) => (
      <View style={{ padding: 8 }}>
        <Story />
      </View>
    ),

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
  secured: false,
  query: '',
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
  - `secured`: Use WSS protocol (default: false)
  - `query`: Additional query parameters

## Metro Configuration

The `metro.config.js` file needs to be wrapped with the `withStorybook` function to enable Storybook features and auto-generation of required files. The wrapper works without any options as it has sensible defaults.

```js
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  // Optional configuration object - all options have defaults and can be omitted like withStorybook(config)
  enabled: true, // Enable/disable Storybook (defaults to true)
  configPath: './.rnstorybook', // Path to Storybook config folder (defaults to ./.rnstorybook)
  useJs: false, // Use JS instead of TS for config files (defaults to false)
  onDisabledRemoveStorybook: false, // Remove Storybook from bundle when disabled (defaults to false)
  websockets: {
    port: 7007, // WebSocket server port (defaults to 7007)
    host: 'localhost', // WebSocket server host (defaults to localhost)
  },
});
```

### Important Notes About Disabling Storybook

The `enabled` and `onDisabledRemoveStorybook` options only affect how Metro bundles Storybook:

- When `enabled: false`, Metro won't generate the `storybook.requires` file
- When `enabled: false` and `onDisabledRemoveStorybook: true`, Metro will also remove Storybook from your bundle

However, you must also ensure your app doesn't render the Storybook UI component when Storybook is disabled. This typically means conditionally rendering Storybook based on the same condition you use for the `enabled` option:

```typescript
// Example of coordinating metro config with UI rendering
const STORYBOOK_ENABLED = process.env.STORYBOOK_ENABLED === 'true';

// metro.config.js
module.exports = withStorybook(config, { enabled: STORYBOOK_ENABLED });

// App.tsx
export default function App() {
  if (STORYBOOK_ENABLED) {
    return <StorybookUIRoot />;
  }
  return <MainApp />;
}
```

## storybook.requires.ts

This is an auto-generated file created by the build process when you use `withStorybook` in your metro config. Unlike the other configuration files, you should never modify this file directly as it's regenerated during builds.

The file handles:

- Loading stories based on patterns in `main.ts`
- Registering configured addons
- Setting up preview configuration
- Managing global Storybook state
- Hot module reloading support

Here's a simplified example of what gets generated:

```typescript
import { start, updateView } from '@storybook/react-native';

// Addon registration from main.ts
import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-backgrounds/register';

// Story loading based on main.ts patterns
const normalizedStories = [
  {
    directory: './components',
    files: '**/*.stories.?(ts|tsx|js|jsx)',
    importPathMatcher: /\.stories\.[tj]sx?$/,
    req: require.context('../components', true, /\.stories\.[tj]sx?$/),
  },
];

// Preview configuration
const annotations = [require('./preview'), require('@storybook/react-native/preview')];

// Global state management
if (!global.view) {
  global.view = start({
    annotations,
    storyEntries: normalizedStories,
  });
} else {
  updateView(global.view, annotations, normalizedStories);
}

export const view = global.view;
```

The file is essential for Storybook to work but requires no manual setup - it's handled automatically by the build process through the `withStorybook` metro configuration.
