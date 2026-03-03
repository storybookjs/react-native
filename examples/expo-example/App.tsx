// fixes fast refresh on web
import '@expo/metro-runtime';

const App =
  process.env.EXPO_PUBLIC_NO_FACTORIES === 'true'
    ? require('./.rnstorybook-nofactories').default
    : require('./.rnstorybook').default;

export default App;
