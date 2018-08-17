function mockPresetsFile(mockPresets) {
  jest.mock('./serverRequire.js', () => () => mockPresets);
}

function mockPreset(name, mockPresetObject) {
  jest.mock(name, () => mockPresetObject, { virtual: true });
}

describe('presets', () => {
  it('does not throw when there is no preset file', () => {
    mockPresetsFile();

    const loadPresets = require.requireActual('./presets').default;
    let presets;

    expect(() => {
      presets = loadPresets(__dirname);
      presets.extendWebpack();
      presets.extendBabel();
      presets.extendPreview();
      presets.extendManager();
    }).not.toThrow();

    expect(presets).toBeDefined();
  });

  it('does not throw when presets are empty', () => {
    mockPresetsFile([]);

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack();
      presets.extendBabel();
      presets.extendPreview();
      presets.extendManager();
    }).not.toThrow();
  });

  it('does not throw when preset can not be loaded', () => {
    mockPresetsFile(['preset-foo']);

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack({});
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel();
    }).not.toThrow();
  });

  it('loads  and applies presets when they are declared as a string', () => {
    mockPresetsFile(['preset-foo', 'preset-bar']);

    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      extendWebpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      extendBabel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack();
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalled();
  });

  it('loads  and applies presets when they are declared as an object without props', () => {
    mockPresetsFile([{ name: 'preset-foo' }, { name: 'preset-bar' }]);

    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      extendWebpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      extendBabel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack();
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalled();
  });

  it('loads and applies presets when they are declared as an object with props', () => {
    mockPresetsFile([
      { name: 'preset-foo', options: { foo: 1 } },
      { name: 'preset-bar', options: { bar: 'a' } },
    ]);

    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      extendWebpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      extendBabel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack({});
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel({});
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalledWith(expect.anything(), { foo: 1 });
    expect(mockPresetBarExtendBabel).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  it('loads and applies  presets when they are declared as a string and as an object', () => {
    mockPresetsFile(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }]);

    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      extendWebpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      extendBabel: mockPresetBarExtendBabel,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack({});
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel({});
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendBabel).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  it('applies presets in chain', () => {
    mockPresetsFile(['preset-foo', { name: 'preset-bar', options: { bar: 'a' } }]);

    const mockPresetFooExtendWebpack = jest.fn(() => ({}));
    const mockPresetBarExtendWebpack = jest.fn(() => ({}));

    mockPreset('preset-foo', {
      extendWebpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      extendWebpack: mockPresetBarExtendWebpack,
    });

    const loadPresets = require.requireActual('./presets').default;
    const presets = loadPresets(__dirname);

    expect(() => {
      presets.extendWebpack({});
      presets.extendPreview();
      presets.extendManager();
      presets.extendBabel();
    }).not.toThrow();

    expect(mockPresetFooExtendWebpack).toBeCalled();
    expect(mockPresetBarExtendWebpack).toBeCalledWith(expect.anything(), { bar: 'a' });
  });

  afterEach(() => {
    jest.resetModules();
  });
});
