---
sidebar_position: 1
---

# Custom UI Component

The `CustomUIComponent` option allows you to completely replace Storybook's default UI with your own implementation. This is useful when you want to integrate Storybook into an unsupported platform or create a completely custom story browsing experience.

## Interface Requirements

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

## Props Explanation

- **`story`** - The currently selected story context with metadata and parameters
- **`storyHash`** - Hash map of all available stories indexed by story ID
- **`setStory`** - Function to programmatically navigate to a story by ID
- **`storage`** - Storage interface for persisting data (typically AsyncStorage)
- **`theme`** - Theme object from `@storybook/react-native-theming`
- **`children`** - The actual story content that must be rendered

## Practical Example

This example shows a mobile-friendly custom UI with a modal-based story selector:

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
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
      >
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

// Usage in index.tsx
const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: MyCustomUI,

  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});
```

## Alternative Approaches

### Using Lite UI Components

You can also use the CustomUIComponent property to pass the lite ui for a ui tha requires less depedencies and is more compatible with other platforms.

```typescript
import { LiteUI } from '@storybook/react-native-ui-lite';

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: LiteUI, // Lightweight alternative to full UI
  // ... other options
});
```

### Conditional Custom UI

You can conditionally use custom UI based on environment or user preferences:

```typescript
const isDevelopment = __DEV__;

const StorybookUIRoot = view.getStorybookUI({
  CustomUIComponent: Platform.OS === 'windows' ? MyCustomUI : undefined,
  // ... other options
});
```

## Important Notes

- The `children` prop contains the rendered story and should be included in your UI
- When `CustomUIComponent` is provided, it completely replaces the default Storybook UI
- Your component receives the same props as the built-in UI components
- You can reference the built-in implementations in `@storybook/react-native-ui` and `@storybook/react-native-ui-lite` for inspiration
- The custom UI is responsible for all navigation and story selection logic
- if onDeviceUI is disabled only the story will render even if the custom UI is provided
