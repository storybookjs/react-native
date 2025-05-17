import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { view } from './storybook.requires';

const isScreenshotTesting = process.env.EXPO_PUBLIC_SCREENSHOT_TESTING === 'true';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: false,
  onDeviceUI: !isScreenshotTesting,
  // host: '192.x.x.x',
  // port: 7007,

  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  // onDeviceUI: true,
  // host: '192.168.1.69',
  /*   theme: {
    brand: {
      image: {
        uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png',
        width: 25,
        height: 25,
      } ,
    },
  }, */

  CustomUIComponent: LiteUI,
});

const StorybookUI = () => {
  if (isScreenshotTesting) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={isScreenshotTesting} />
        <SafeAreaProvider style={{ flex: 1 }}>
          <ThemeProvider theme={theme}>
            <StorybookUIRoot />
          </ThemeProvider>
        </SafeAreaProvider>
      </SafeAreaView>
    );
  }

  return <StorybookUIRoot />;
};

export default StorybookUI;
