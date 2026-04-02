jest.mock('./metro/channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../scripts/generate', () => ({
  generate: jest.fn(),
}));

jest.mock('storybook/internal/common', () => ({
  optionalEnvToBoolean: jest.fn(() => true),
}));

jest.mock('storybook/internal/telemetry', () => ({
  telemetry: jest.fn(() => Promise.resolve()),
}));

describe('enhanceRepackConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('adds StorybookPlugin to plugins array', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { plugins: [], module: { rules: [] } };

    const result = enhanceRepackConfig(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(result.plugins).toHaveLength(1);
    expect(typeof result.plugins[0].apply).toBe('function');
  });

  test('preserves existing plugins', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const existingPlugin = { apply: jest.fn() };
    const rspackConfig = { plugins: [existingPlugin] };

    const result = enhanceRepackConfig(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(result.plugins).toHaveLength(2);
    expect(result.plugins[0]).toBe(existingPlugin);
  });

  test('handles config without plugins array', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { module: { rules: [] } };

    const result = enhanceRepackConfig(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(result.plugins).toHaveLength(1);
  });

  test('passes options to StorybookPlugin', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const { createChannelServer } = require('./metro/channelServer');

    const rspackConfig = { plugins: [] };
    const compiler = {
      options: { resolve: {} },
      hooks: { beforeCompile: { tapPromise: jest.fn() } },
      webpack: {
        NormalModuleReplacementPlugin: class {
          apply() {}
        },
      },
    };

    const result = enhanceRepackConfig(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      websockets: { host: '10.0.0.5', port: 9999 },
    });

    result.plugins[0].apply(compiler);

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 9999,
      })
    );
  });
});
