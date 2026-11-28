/**
 * Loaded first by the generated `storybook.requires` file, before any `storybook/*` module.
 *
 * `storybook/test` bundles `@vitest/spy`, which creates a `FinalizationRegistry` as soon as it is
 * imported, and Storybook imports it at startup. Hermes before React Native 0.88 has `WeakRef` but
 * no `FinalizationRegistry`, so the app would fail with "Property 'FinalizationRegistry' doesn't
 * exist" before anything renders.
 *
 * Garbage collection can't be observed from JavaScript, so this registry never calls its cleanup
 * callback. That is allowed: engines don't guarantee that finalizers run. The registry is only
 * used to drop bookkeeping for mocks that were collected.
 */
if (typeof globalThis.FinalizationRegistry === 'undefined') {
  class NoopFinalizationRegistry {
    register() {}

    unregister() {
      return false;
    }
  }

  (globalThis as any).FinalizationRegistry = NoopFinalizationRegistry;
}

export {};
