import type { MetroConfig } from 'metro-config';
import { createChannelServer } from './metro/channelServer';
import { generate } from '../scripts/generate';

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

describe('withStorybook (unified)', () => {
  const metroConfig = { resolver: {}, transformer: {} } as MetroConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STORYBOOK_DISABLE_TELEMETRY = 'true';
  });

  afterEach(() => {
    delete process.env.STORYBOOK_DISABLE_TELEMETRY;
    delete process.env.STORYBOOK_ENABLED;
    delete process.env.STORYBOOK_WS_HOST;
    delete process.env.STORYBOOK_WS_PORT;
    delete process.env.STORYBOOK_WS_SECURED;
    jest.resetModules();
  });

  test('detects Metro config and delegates to metro path', () => {
    const { withStorybook } = require('./withStorybook');

    const result = withStorybook(metroConfig, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    // Metro path produces transformer + resolver
    expect(result.transformer).toBeDefined();
    expect(result.resolver).toBeDefined();
    expect(generate).toHaveBeenCalled();
  });

  test('detects rspack/webpack config and adds StorybookPlugin', () => {
    const { withStorybook } = require('./withStorybook');
    const rspackConfig = {
      plugins: [],
      module: { rules: [] },
    };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    // Repack path adds a plugin
    expect(result.plugins).toHaveLength(1);
    expect(result.plugins[0]).toBeDefined();
    expect(typeof result.plugins[0].apply).toBe('function');
  });

  test('preserves existing rspack plugins', () => {
    const { withStorybook } = require('./withStorybook');
    const existingPlugin = { apply: jest.fn() };
    const rspackConfig = {
      plugins: [existingPlugin],
      module: { rules: [] },
    };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    expect(result.plugins).toHaveLength(2);
    expect(result.plugins[0]).toBe(existingPlugin);
  });

  test('handles rspack config without plugins array', () => {
    const { withStorybook } = require('./withStorybook');
    const rspackConfig = {
      module: { rules: [] },
    };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    expect(result.plugins).toHaveLength(1);
  });

  test('uses default options when none provided', () => {
    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { generate: mockGenerate } = require('../scripts/generate');
    const { withStorybook } = require('./withStorybook');

    expect(() => withStorybook(metroConfig)).not.toThrow();
    expect(mockGenerate).toHaveBeenCalled();
  });

  test('applies ws env overrides for rspack config', () => {
    process.env.STORYBOOK_WS_HOST = '10.0.0.5';
    process.env.STORYBOOK_WS_PORT = '9999';

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./metro/channelServer');
    const { generate: mockGenerate } = require('../scripts/generate');
    const { withStorybook } = require('./withStorybook');

    const rspackConfig = { plugins: [] };

    // Create a mock compiler to apply the plugin
    const compiler = {
      options: { resolve: {} },
      hooks: { beforeCompile: { tapPromise: jest.fn() } },
      webpack: {
        NormalModuleReplacementPlugin: class {
          apply() {}
        },
      },
    };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: { port: 7007 },
    });

    // Apply the plugin to verify ws env overrides propagated
    result.plugins[0].apply(compiler);

    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 9999,
      })
    );
  });
});
