import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { StatusBar, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { view } from './storybook.requires';

const isScreenshotTesting = process.env.EXPO_PUBLIC_SCREENSHOT_TESTING === 'true';
const isLiteUI = process.env.EXPO_PUBLIC_LITE_UI === 'true';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,
  CustomUIComponent: isScreenshotTesting
    ? ({ children, story }) => {
        return (
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar hidden />
              <View
                style={{ flex: 1 }}
                accessibilityLabel={story?.id}
                testID={story?.id}
                accessible
              >
                {children}
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
        );
      }
    : isLiteUI
      ? LiteUI
      : undefined,
});

export default StorybookUIRoot;
