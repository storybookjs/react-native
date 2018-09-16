function mockPreset(name, mockPresetObject) {
  jest.mock(name, () => mockPresetObject, { virtual: true });
}

describe('presets', () => {
  it('does not throw when there is no preset file', () => {
    const loadPresets = require.requireActual('./presets').default;
    let presets;

    expect(() => {
      presets = loadPresets();
      presets.webpack();
      presets.babel();
      presets.preview();
      presets.manager();
    }).not.toThrow();

    expect(presets).toBeDefined();
  });

  it('does not throw when presets are empty', () => {
    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets([]);

    expect(() => {
      presets.webpack();
      presets.babel();
      presets.preview();
      presets.manager();
    }).not.toThrow();
  });

  it('does not throw when preset can not be loaded', () => {
    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(['preset-foo']);

    expect(() => {
      presets.webpack({});
      presets.preview();
      presets.manager();
      presets.babel();
    }).not.toThrow();
  });

  it('loads  and applies presets when they are declared as a string', () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(['preset-foo', 'preset-bar']);

    expect(() => {
      presets.webpack();
      presets.preview();
      presets.manager();
      presets.babel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalled();
  });

  it('loads  and applies presets when they are declared as an object without props', () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets([{ name: 'preset-foo' }, { name: 'preset-bar' }]);

    expect(() => {
      presets.webpack();
      presets.preview();
      presets.manager();
      presets.babel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalled();
  });

  it('loads and applies presets when they are declared as an object with props', () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets([
      { name: 'preset-foo', options: { foo: 1 } },
      { name: 'preset-bar', options: { bar: 'a' } },
    ]);

    expect(() => {
      presets.webpack({});
      presets.preview();
      presets.manager();
      presets.babel({});
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalledWith(expect.anything(), { foo: 1 });
    expect(mockPresetBarExtendBabel).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  it('loads and applies  presets when they are declared as a string and as an object', () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }]);

    expect(() => {
      presets.webpack({});
      presets.preview();
      presets.manager();
      presets.babel({});
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  it('applies presets in chain', () => {
    const mockPresetFooExtendWebpack = jest.fn(() => ({}));
    const mockPresetBarExtendWebpack = jest.fn(() => ({}));

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      webpack: mockPresetBarExtendWebpack,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }]);

    expect(() => {
      presets.webpack({});
      presets.preview();
      presets.manager();
      presets.babel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendWebpack).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  afterEach(() => {
    jest.resetModules();
  });
});
