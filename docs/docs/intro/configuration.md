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
