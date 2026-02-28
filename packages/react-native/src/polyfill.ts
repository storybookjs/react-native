import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  // We polyfill URLSearchParams for React Native since URLSearchParams.get is not implemented yet is used in storybook
  // with expo this would never run because its already polyfilled
  try {
    let params = new URLSearchParams({ test: '1' });

    // the base react native url implementation throws an error when trying to access this function
    params.get('test');
  } catch {
    const { setupURLPolyfill } = require('react-native-url-polyfill');

    setupURLPolyfill();
  }
}

// Note this is a workaround for setImmediate not being defined
if (Platform.OS === 'web' && typeof globalThis.setImmediate === 'undefined') {
  require('setimmediate');
}
