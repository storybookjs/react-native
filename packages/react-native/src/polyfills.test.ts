describe('polyfills', () => {
  const original = globalThis.FinalizationRegistry;

  afterEach(() => {
    globalThis.FinalizationRegistry = original;
    jest.resetModules();
  });

  test('adds a FinalizationRegistry when the engine has none', () => {
    // @ts-expect-error simulating Hermes before React Native 0.88
    delete globalThis.FinalizationRegistry;

    require('./polyfills');

    const cleanup = jest.fn();
    const registry = new globalThis.FinalizationRegistry(cleanup);
    const target = {};
    const token = {};

    expect(registry.register(target, 'held', token)).toBeUndefined();
    expect(registry.unregister(token)).toBe(false);
    expect(cleanup).not.toHaveBeenCalled();
  });

  test('keeps the FinalizationRegistry of the engine', () => {
    require('./polyfills');

    expect(globalThis.FinalizationRegistry).toBe(original);
  });
});
