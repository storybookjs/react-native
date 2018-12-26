function wrapPreset(basePresets) {
  return {
    babel: async (config, args) => basePresets.apply('babel', config, args),
    webpack: async (config, args) => basePresets.apply('webpack', config, args),
  };
}

function mockPreset(name, mockPresetObject) {
  jest.mock(name, () => mockPresetObject, { virtual: true });
}

describe('presets', () => {
  it('does not throw when there is no preset file', async () => {
    const loadPresets = require.requireActual('./presets').default;
    let presets;

    async function testPresets() {
      presets = wrapPreset(loadPresets());
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(presets).toBeDefined();
  });

  it('does not throw when presets are empty', async () => {
    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(loadPresets([]));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('does not throw when preset can not be loaded', async () => {
    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(loadPresets(['preset-foo']));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('loads  and applies presets when they are declared as a string', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(loadPresets(['preset-foo', 'preset-bar']));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalled();
  });

  it('loads  and applies presets when they are declared as an object without props', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(loadPresets([{ name: 'preset-foo' }, { name: 'preset-bar' }]));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalled();
  });

  it('loads and applies presets when they are declared as an object with props', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      loadPresets([
        { name: 'preset-foo', options: { foo: 1 } },
        { name: 'preset-bar', options: { bar: 'a' } },
      ])
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalledWith(expect.anything(), { foo: 1 });
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), { bar: 'a' });
  });

  it('loads and applies  presets when they are declared as a string and as an object', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      loadPresets(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }])
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), { bar: 'a' });
  });

  it('applies presets in chain', async () => {
    const mockPresetFooExtendWebpack = jest.fn(() => ({}));
    const mockPresetBarExtendWebpack = jest.fn(() => ({}));

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      webpack: mockPresetBarExtendWebpack,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      loadPresets(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }])
    );

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendWebpack).toHaveBeenCalledWith(expect.anything(), { bar: 'a' });
  });

  afterEach(() => {
    jest.resetModules();
  });
});
