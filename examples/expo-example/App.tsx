// fixes fast refresh on web
import '@expo/metro-runtime';
import { LogBox } from 'react-native';

if (process.env.EXPO_PUBLIC_SCREENSHOT_TESTING === 'true') {
  LogBox.ignoreAllLogs(true);
}

const App =
  process.env.EXPO_PUBLIC_NO_FACTORIES === 'true'
    ? require('./.rnstorybook-nofactories').default
    : require('./.rnstorybook').default;

export default App;
