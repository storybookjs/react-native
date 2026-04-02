import type { MetroConfig } from 'metro-config';

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

  test('returns config unchanged when STORYBOOK_ENABLED is not set', () => {
    delete process.env.STORYBOOK_ENABLED;

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { withStorybook } = require('./withStorybook');
    const { generate: mockGenerate } = require('../scripts/generate');

    const result = withStorybook(metroConfig);

    expect(result).toBe(metroConfig);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  test('returns config unchanged when STORYBOOK_ENABLED is false', () => {
    process.env.STORYBOOK_ENABLED = 'false';

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { withStorybook } = require('./withStorybook');

    const result = withStorybook(metroConfig);

    expect(result).toBe(metroConfig);
  });

  test('detects Metro config and delegates when STORYBOOK_ENABLED=true', () => {
    process.env.STORYBOOK_ENABLED = 'true';

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { generate: mockGenerate } = require('../scripts/generate');
    const { withStorybook } = require('./withStorybook');

    const result = withStorybook(metroConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(result.transformer).toBeDefined();
    expect(result.resolver).toBeDefined();
    expect(mockGenerate).toHaveBeenCalled();
  });

  test('detects rspack/webpack config and calls generate', () => {
    process.env.STORYBOOK_ENABLED = 'true';

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { generate: mockGenerate } = require('../scripts/generate');
    const { withStorybook } = require('./withStorybook');
    const rspackConfig = { plugins: [], module: { rules: [] } };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(mockGenerate).toHaveBeenCalled();
    // No StorybookPlugin added — config plugins preserved as-is
    expect(result.plugins).toHaveLength(0);
  });

  test('applies ws env overrides for metro config', () => {
    process.env.STORYBOOK_ENABLED = 'true';
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
    const { withStorybook } = require('./withStorybook');

    withStorybook(metroConfig, {
      configPath: '/tmp/.rnstorybook',
      websockets: { port: 7007 },
    });

    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 9999,
      })
    );
  });

  test('applies ws env overrides for rspack config', () => {
    process.env.STORYBOOK_ENABLED = 'true';
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
    const { withStorybook } = require('./withStorybook');

    const rspackConfig = { plugins: [] };

    withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
      websockets: { port: 7007 },
    });

    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 9999,
      })
    );
  });

  test('preserves existing rspack plugins', () => {
    process.env.STORYBOOK_ENABLED = 'true';

    jest.resetModules();
    jest.mock('./metro/channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { withStorybook } = require('./withStorybook');
    const existingPlugin = { apply: jest.fn() };
    const rspackConfig = { plugins: [existingPlugin] };

    const result = withStorybook(rspackConfig, {
      configPath: '/tmp/.rnstorybook',
    });

    // No swap files found in test env, so config returned as-is with plugins preserved
    expect(result.plugins).toHaveLength(1);
    expect(result.plugins[0]).toBe(existingPlugin);
  });
});
