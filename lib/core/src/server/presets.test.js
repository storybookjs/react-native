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

jest.mock('./utils/resolve-file', () => ({
  resolveFile: name => {
    const KNOWN_FILES = [
      '@storybook/addon-actions/register',
      '@storybook/addon-knobs/register',
      '@storybook/addon-docs/preset',
    ];
    if (KNOWN_FILES.includes(name)) {
      return name;
    }
    throw new Error(`Cannot find module '${name}'`);
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

describe('resolveAddonName', () => {
  const { resolveAddonName } = require.requireActual('./presets');

  it('should resolve packages with metadata (relative path)', () => {
    expect(resolveAddonName('@storybook/addon-docs')).toEqual({
      name: '@storybook/addon-docs/preset',
      type: 'presets',
    });
  });

  it('should resolve packages with metadata (absolute path)', () => {
    expect(resolveAddonName('@storybook/addon-knobs')).toEqual({
      name: '@storybook/addon-knobs/register',
      type: 'managerEntries',
    });
  });

  it('should resolve packages without metadata', () => {
    expect(resolveAddonName('@storybook/preset-create-react-app')).toEqual({
      name: '@storybook/preset-create-react-app',
      type: 'presets',
    });
  });

  it('should resolve managerEntries', () => {
    expect(resolveAddonName('@storybook/addon-actions/register')).toEqual({
      name: '@storybook/addon-actions/register',
      type: 'managerEntries',
    });
  });

  it('should resolve presets', () => {
    expect(resolveAddonName('@storybook/addon-docs/preset')).toEqual({
      name: '@storybook/addon-docs/preset',
      type: 'presets',
    });
  });

  it('should resolve preset packages', () => {
    expect(resolveAddonName('@storybook/addon-essentials')).toEqual({
      name: '@storybook/addon-essentials',
      type: 'presets',
    });
  });

  it('should error on invalid inputs', () => {
    expect(() => resolveAddonName(null)).toThrow();
  });
});

describe('splitAddons', () => {
  const { splitAddons } = require.requireActual('./presets');

  it('should split managerEntries that end in register', () => {
    const addons = [
      '@storybook/addon-actions/register',
      'storybook-addon-readme/register',
      'addon-foo/register.js',
    ];
    expect(splitAddons(addons)).toEqual({
      managerEntries: addons,
      presets: [],
    });
  });

  it('should split preset packages and package entries', () => {
    const addons = [
      '@storybook/addon-essentials',
      '@storybook/addon-docs/presets',
      'addon-bar/presets.js',
    ];
    expect(splitAddons(addons)).toEqual({
      managerEntries: [],
      presets: addons,
    });
  });

  it('should split preset objects', () => {
    const addons = [
      { name: '@storybook/addon-essentials' },
      { name: '@storybook/addon-docs/presets', options: { configureJSX: true } },
    ];
    expect(splitAddons(addons)).toEqual({
      managerEntries: [],
      presets: addons,
    });
  });

  it('should skip invalid objects', () => {
    const addons = [1, true, { foo: 'bar' }];
    expect(splitAddons(addons)).toEqual({
      managerEntries: [],
      presets: [],
    });
  });
});
