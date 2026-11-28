import { Platform } from 'react-native';

/**
 * Everything Storybook needs from the JavaScript environment that React Native may not provide.
 *
 * The generated `storybook.requires` file imports this first, before any `storybook/*` module, so
 * polyfills for code that runs while those modules load belong here too.
 */

// `storybook/test` bundles `@vitest/spy`, which creates a `FinalizationRegistry` as soon as it is
// imported, and Storybook imports it at startup. Hermes before React Native 0.88 has `WeakRef` but
// no `FinalizationRegistry`, so the app would fail with "Property 'FinalizationRegistry' doesn't
// exist" before anything renders.
//
// Garbage collection can't be observed from JavaScript, so this registry never calls its cleanup
// callback. That is allowed: engines don't guarantee that finalizers run. The registry is only
// used to drop bookkeeping for mocks that were collected.
if (typeof globalThis.FinalizationRegistry === 'undefined') {
  class NoopFinalizationRegistry {
    register() {}

    unregister() {
      return false;
    }
  }

  (globalThis as any).FinalizationRegistry = NoopFinalizationRegistry;
}

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
