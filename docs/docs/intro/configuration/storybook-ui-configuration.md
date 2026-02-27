---
sidebar_position: 4
---

# Storybook UI Configuration

The `getStorybookUI` function configures how Storybook renders and behaves in your React Native app. This page covers all available options and their usage.

## Basic Usage

```typescript
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  // Options go here
});

export default StorybookUIRoot;
```

## Complete Options Reference

```typescript
const StorybookUIRoot = view.getStorybookUI({
  // UI Behavior
  onDeviceUI: true,
  shouldPersistSelection: true,

  // Initial Story
  initialSelection: {
    kind: 'Components/Button',
    name: 'Primary',
  },

  // Theme Customization
  theme: {
    // Theme options (see Theme section below)
  },

  // Storage Implementation
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },

  // WebSocket Configuration
  enableWebsockets: false,
  host: 'localhost',
  port: 7007,
  // Custom UI Component
  CustomUIComponent: undefined,
});
```

## Option Details

### UI Behavior Options

#### `onDeviceUI` (boolean)

- **Default**: `true`
- **Purpose**: Enable or disable the on-device UI (story navigator, addons panel)
- **Use Case**: Set to `false` when using only WebSocket control or custom UI

```typescript
// Story-only mode (no UI controls)
const StorybookUIRoot = view.getStorybookUI({
  onDeviceUI: false,
});
```

#### `shouldPersistSelection` (boolean)

- **Default**: `true`
- **Purpose**: Remember the last viewed story between app launches
- **Storage**: Requires a storage implementation

```typescript
const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});
```

### Initial Story Selection

#### `initialSelection` (object | string)

- **Default**: First story in the index
- **Purpose**: Set which story displays on first launch
- **Formats**:
  - Object: `{ kind: string, name: string }`
  - String: `'kind--name'`

```typescript
// Object format (recommended)
const StorybookUIRoot = view.getStorybookUI({
  initialSelection: {
    kind: 'Components/Button',
    name: 'Primary',
  },
});

// String format
const StorybookUIRoot = view.getStorybookUI({
  initialSelection: 'components-button--primary',
});
```

### Theme Configuration

#### `theme` (object)

- **Default**: Built-in light theme
- **Purpose**: Customize the appearance of Storybook UI
- **Interface**: Uses `StorybookTheme` interface from `@storybook/react-native-theming`

#### Using Built-in Themes

```typescript
import { theme, darkTheme } from '@storybook/react-native-theming';

// Use built-in light theme
const StorybookUIRoot = view.getStorybookUI({
  theme: theme,
});

// Use built-in dark theme
const StorybookUIRoot = view.getStorybookUI({
  theme: darkTheme,
});
```

#### Custom Theme Structure

```typescript
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  theme: {
    // Base theme type
    base: 'light', // or 'dark'

    // Text color for muted elements
    textMutedColor: '#5C6870',

    // Color palette
    color: {
      primary: '#FF4785',
      secondary: '#029CFD',
      tertiary: '#FAFBFC',

      // Status colors
      positive: '#66BF3C',
      negative: '#FF4400',
      warning: '#E69D00',

      // Text colors
      defaultText: '#2E3438',
      inverseText: '#FFFFFF',

      // Monochrome scale
      lightest: '#FFFFFF',
      lighter: '#F7FAFC',
      light: '#EEF3F6',
      medium: '#D9E8F2',
      dark: '#5C6870',
      darkest: '#2E3438',
    },

    // Background colors
    background: {
      app: '#F6F9FC',
      bar: '#FFFFFF',
      content: '#FFFFFF',
      preview: '#FFFFFF',
    },

    // Typography settings
    typography: {
      weight: {
        regular: '400',
        bold: '700',
      },
      size: {
        s1: 12,
        s2: 14,
        s3: 16,
        m1: 20,
        m2: 24,
        m3: 28,
        l1: 32,
        l2: 40,
        l3: 48,
      },
    },

    // Input field styling
    input: {
      background: '#FFFFFF',
      border: 'hsla(203, 50%, 30%, 0.15)',
      borderRadius: 4,
      color: '#2E3438',
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    // Button styling
    button: {
      background: '#F6F9FC',
      border: '#D9E8F2',
    },

    // Boolean control styling
    boolean: {
      background: '#ECF4F9',
      selectedBackground: '#FFFFFF',
    },

    // Layout and borders
    layoutMargin: 10,
    appBorderColor: 'hsla(203, 50%, 30%, 0.15)',
    appBorderRadius: 4,

    // Toolbar colors
    barTextColor: '#73828C',
    barHoverColor: '#029CFD',
    barSelectedColor: '#029CFD',
    barBg: '#FFFFFF',

    // Brand customization
    brand: {
      title: 'My App Storybook',
      url: 'https://myapp.com',
      image: require('./logo.png'), // or URI
    },
  },
});

export default StorybookUIRoot;
```

### Storage Configuration

#### `storage` (object)

- **Default**: No storage (selection not persisted)
- **Purpose**: Persist UI state between sessions
- **Interface**:
  ```typescript
  interface Storage {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
  }
  ```

#### AsyncStorage (Most Common)

```typescript
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

#### MMKV (High Performance)

If you prefer using MMKV for better performance:

```typescript
import { view } from './storybook.requires';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: async (key) => storage.getString(key) ?? null,
    setItem: async (key, value) => storage.set(key, value),
  },
});

export default StorybookUIRoot;
```

### WebSocket Options

Enable remote control of Storybook from external tools:

#### `enableWebsockets` (boolean)

- **Default**: `false`
- **Purpose**: Enable WebSocket server for remote control

#### `host` (string)

- **Default**: `'localhost'`
- **Purpose**: WebSocket server hostname
- **Note**: Use your machine's IP for physical devices

#### `port` (number)

- **Default**: `7007`
- **Purpose**: WebSocket server port

```typescript
const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
  host: '192.168.1.100', // Your machine's IP
  port: 7007,
});
```

### Custom UI Component

#### `CustomUIComponent` (React Component)

- **Default**: `undefined` (uses built-in UI)
- **Purpose**: Replace default UI with custom implementation
- **Interface**: Must implement the `SBUI` interface

The `CustomUIComponent` option allows you to completely replace Storybook's default UI with your own implementation. This is useful when you want to integrate Storybook into an unsupported platform or create a completely custom story browsing experience.

#### Interface Requirements

Your custom UI component must implement the `SBUI` interface:

```typescript
type SBUI = (props: {
  story?: StoryContext<ReactRenderer, Args>;
  storyHash: API_IndexHash;
  setStory: (storyId: string) => void;
  storage: Storage;
  theme: Theme;
  children: ReactElement;
}) => ReactElement;
```

#### Props Explanation

- **`story`** - The currently selected story context with metadata and parameters
- **`storyHash`** - Hash map of all available stories indexed by story ID
- **`setStory`** - Function to programmatically navigate to a story by ID
- **`storage`** - Storage interface for persisting data (typically AsyncStorage)
- **`theme`** - Theme object from `@storybook/react-native-theming`
- **`children`** - The actual story content that must be rendered

#### Practical Example

This example shows a basic custom UI with a modal-based story selector:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { view } from './storybook.requires';
import { SBUI } from '@storybook/react-native-ui-common';
import { useMemo, useState } from 'react';

const MyCustomUI: SBUI = ({ story, storyHash, setStory, children }) => {
  const stories = useMemo(() => Object.values(storyHash), [storyHash]);
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      {/* Story Navigation Modal */}
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView style={{ backgroundColor: '#f5f5f5' }}>
            <Text style={{ fontSize: 18, padding: 16 }}>Stories</Text>
            {stories.map((item) => {
              if (item.type !== 'story') {
                // Handle non-story items (groups, docs, etc.)
                return null;
              }

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setStory(item.id);
                    setShowModal(false);
                  }}
                  style={{
                    padding: 12,
                    backgroundColor: story?.id === item.id ? '#007AFF' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: story?.id === item.id ? 'white' : 'black',
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Story Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Story Navigation Button */}
      <Button title="Show Stories" onPress={() => setShowModal(true)} />
    </SafeAreaView>
  );
};

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: MyCustomUI,

  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

#### Alternative Approaches

##### Using Lite UI Components

You can also use the CustomUIComponent property to pass the lite ui for a ui that requires less dependencies and is more compatible with other platforms.

```typescript
import { view } from './storybook.requires';
import { LiteUI } from '@storybook/react-native-ui-lite';

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: LiteUI, // Lightweight alternative to full UI
  // ... other options
});

export default StorybookUIRoot;
```

##### Conditional Custom UI

You can conditionally use custom UI based on environment or user preferences:

```typescript
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: Platform.OS === 'windows' ? MyCustomUI : undefined,
  // ... other options
});

export default StorybookUIRoot;
```

#### Important Notes

- The `children` prop contains the rendered story and should be included in your UI
- When `CustomUIComponent` is provided, it completely replaces the default Storybook UI
- Your component receives the same props as the built-in UI components
- You can reference the built-in implementations in `@storybook/react-native-ui` and `@storybook/react-native-ui-lite` for inspiration
- The custom UI is responsible for all navigation and story selection logic
- If onDeviceUI is disabled only the story will render even if the custom UI is provided

## Common Configurations

### Standard Setup

```typescript
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

### Testing Setup

```typescript
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  onDeviceUI: false, // No UI for automated tests
  enableWebsockets: true,
  host: 'localhost', // use websocket server to control storybook
  port: 7007,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```
