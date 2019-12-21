function wrapPreset(basePresets) {
  return {
    babel: async (config, args) => basePresets.apply('babel', config, args),
    webpack: async (config, args) => basePresets.apply('webpack', config, args),
  };
}

function mockPreset(name, mockPresetObject) {
  jest.mock(name, () => mockPresetObject, { virtual: true });
}

jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('presets', () => {
  it('does not throw when there is no preset file', async () => {
    const getPresets = require.requireActual('./presets').default;
    let presets;

    async function testPresets() {
      presets = wrapPreset(getPresets());
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(presets).toBeDefined();
  });

  it('does not throw when presets are empty', async () => {
    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(getPresets([]));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('does not throw when preset can not be loaded', async () => {
    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(getPresets(['preset-foo']));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('loads and applies presets when they are combined in another preset', async () => {
    mockPreset('preset-foo', {
      foo: exec => exec.concat('foo'),
    });

    mockPreset('preset-bar', {
      foo: exec => exec.concat('bar'),
    });

    mockPreset('preset-got', [
      'preset-dracarys',
      { name: 'preset-valar', options: { custom: 'morghulis' } },
    ]);

    mockPreset('preset-dracarys', {
      foo: exec => exec.concat('dracarys'),
    });

    mockPreset('preset-valar', {
      foo: (exec, options) => exec.concat(`valar ${options.custom}`),
    });

    const getPresets = require.requireActual('./presets').default;
    const presets = getPresets(['preset-foo', 'preset-got', 'preset-bar']);

    const result = await presets.apply('foo', []);

    expect(result).toEqual(['foo', 'dracarys', 'valar morghulis', 'bar']);
  });

  it('loads and applies presets when they are declared as a string', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(getPresets(['preset-foo', 'preset-bar']));

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

    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(getPresets([{ name: 'preset-foo' }, { name: 'preset-bar' }]));

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

    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      getPresets([
        { name: 'preset-foo', options: { foo: 1 } },
        { name: 'preset-bar', options: { bar: 'a' } },
      ])
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalledWith(expect.anything(), {
      foo: 1,
      presetsList: expect.anything(),
    });
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.anything(),
    });
  });

  it('loads and applies presets when they are declared as a string and as an object', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      getPresets([
        'preset-foo',
        {
          name: 'preset-bar',
          options: {
            bar: 'a',
          },
        },
      ])
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.arrayContaining([
        expect.objectContaining({ name: 'preset-foo' }),
        expect.objectContaining({ name: 'preset-bar' }),
      ]),
    });
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

    const getPresets = require.requireActual('./presets').default;
    const presets = wrapPreset(
      getPresets([
        'preset-foo',
        {
          name: 'preset-bar',
          options: {
            bar: 'a',
            presetsList: expect.arrayContaining([
              expect.objectContaining({ name: 'preset-foo' }),
              expect.objectContaining({ name: 'preset-bar' }),
            ]),
          },
        },
      ])
    );

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendWebpack).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.arrayContaining([
        expect.objectContaining({ name: 'preset-foo' }),
        expect.objectContaining({ name: 'preset-bar' }),
      ]),
    });
  });

  it('allows for presets to export presets array', async () => {
    const getPresets = require.requireActual('./presets').default;
    const input = {};
    const mockPresetBar = jest.fn(() => input);

    mockPreset('preset-foo', {
      presets: ['preset-bar'],
    });

    mockPreset('preset-bar', {
      bar: mockPresetBar,
    });

    const presets = getPresets(['preset-foo']);

    const output = await presets.apply('bar');

    expect(mockPresetBar).toHaveBeenCalledWith(undefined, expect.any(Object));

    expect(input).toBe(output);
  });

  it('allows for presets to export presets fn', async () => {
    const getPresets = require.requireActual('./presets').default;
    const input = {};
    const storybookOptions = { a: 1 };
    const presetOptions = { b: 2 };
    const mockPresetBar = jest.fn(() => input);
    const mockPresetFoo = jest.fn(() => ['preset-bar']);

    mockPreset('preset-foo', {
      presets: mockPresetFoo,
    });

    mockPreset('preset-bar', {
      bar: mockPresetBar,
    });

    const presets = getPresets([{ name: 'preset-foo', options: { b: 2 } }], storybookOptions);

    const output = await presets.apply('bar');

    expect(mockPresetFoo).toHaveBeenCalledWith({ ...storybookOptions, ...presetOptions });
    expect(mockPresetBar).toHaveBeenCalledWith(undefined, expect.any(Object));

    expect(input).toBe(output);
  });

  afterEach(() => {
    jest.resetModules();
  });
});
