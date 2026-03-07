// fixes fast refresh on web
import '@expo/metro-runtime';
import { LogBox } from 'react-native';

if (process.env.EXPO_PUBLIC_SCREENSHOT_TESTING === 'true') {
  LogBox.ignoreAllLogs(true);
}

export { default } from './.rnstorybook';
