import type { MetroConfig } from 'metro-config';
import { createChannelServer } from './channelServer';
import { generate } from '../../scripts/generate';
import { optionalEnvToBoolean } from 'storybook/internal/common';
import { telemetry } from 'storybook/internal/telemetry';

jest.mock('./channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../../scripts/generate', () => ({
  generate: jest.fn(),
}));

jest.mock('storybook/internal/common', () => ({
  optionalEnvToBoolean: jest.fn(() => true),
}));

jest.mock('storybook/internal/telemetry', () => ({
  telemetry: jest.fn(() => Promise.resolve()),
}));

describe('withStorybook experimental_mcp', () => {
  const config = { resolver: {}, transformer: {} } as MetroConfig;
  const { withStorybook } = require('./withStorybook');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STORYBOOK_DISABLE_TELEMETRY = 'true';
  });

  afterEach(() => {
    delete process.env.STORYBOOK_DISABLE_TELEMETRY;
    delete process.env.STORYBOOK_WS_HOST;
    delete process.env.STORYBOOK_WS_PORT;
    delete process.env.STORYBOOK_WS_SECURED;
  });

  test('starts MCP server when enabled without websockets', () => {
    expect(() =>
      withStorybook(config, {
        configPath: '/tmp/.rnstorybook',
        enabled: true,
        experimental_mcp: true,
      })
    ).not.toThrow();

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        experimental_mcp: true,
        websockets: false,
      })
    );

    const generateArgs = (generate as jest.Mock).mock.calls[0][0];
    expect(generateArgs).toEqual(
      expect.objectContaining({
        configPath: '/tmp/.rnstorybook',
      })
    );
    expect(generateArgs.host).toBeUndefined();
    expect(generateArgs.port).toBeUndefined();
  });

  test('reports telemetry with the resolved configDir so framework metadata is captured', () => {
    (optionalEnvToBoolean as jest.Mock).mockReturnValue(false);

    withStorybook(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });
    expect(telemetry).toHaveBeenCalledWith(
      'dev',
      {},
      expect.objectContaining({ configDir: '/tmp/.rnstorybook' })
    );
  });

  test('passes experimental_mcp to channel server when websockets are configured', () => {
    withStorybook(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      experimental_mcp: true,
      websockets: 'auto',
    });

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({ experimental_mcp: true, websockets: true })
    );
    expect(generate).toHaveBeenCalled();
  });

  test('passes secure websocket options through to the channel server and generator', () => {
    withStorybook(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: {
        host: '127.0.0.1',
        port: 7007,
        secured: true,
        cert: 'cert',
        key: 'key',
      },
    });

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        configPath: '/tmp/.rnstorybook',
        websockets: true,
        secured: true,
        ssl: expect.objectContaining({
          cert: 'cert',
          key: 'key',
        }),
      })
    );

    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        configPath: '/tmp/.rnstorybook',
        host: '127.0.0.1',
        port: 7007,
        secured: true,
      })
    );
  });

  test('does not throw when storybook is disabled', () => {
    expect(() =>
      withStorybook(config, {
        configPath: '/tmp/.rnstorybook',
        enabled: false,
        experimental_mcp: true,
      })
    ).not.toThrow();
  });

  test('applies STORYBOOK_WS_* env when websockets option is omitted', () => {
    process.env.STORYBOOK_WS_HOST = '192.168.1.10';
    process.env.STORYBOOK_WS_PORT = '8123';

    withStorybook(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '192.168.1.10',
        port: 8123,
        websockets: true,
      })
    );

    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        configPath: '/tmp/.rnstorybook',
        host: '192.168.1.10',
        port: 8123,
      })
    );
  });
});

describe('withStorybook node built-in resolution', () => {
  const resolveRequest = jest.fn((_ctx: any, name: string) => ({
    filePath: `/node_modules/${name}/index.js`,
    type: 'sourceFile',
  }));

  const config = {
    resolver: { resolveRequest },
    transformer: {},
  } as unknown as MetroConfig;

  const { withStorybook } = require('./withStorybook');

  test.each(['os', 'tty'])('replaces %s with empty on native platforms', (mod) => {
    const result = withStorybook(config, { configPath: '/tmp/.rnstorybook', enabled: true });

    expect(result.resolver.resolveRequest({}, mod, 'ios')).toEqual({ type: 'empty' });
    expect(result.resolver.resolveRequest({}, mod, 'android')).toEqual({ type: 'empty' });
  });

  test.each(['os', 'tty'])('preserves real %s on web for Expo API Routes', (mod) => {
    const result = withStorybook(config, { configPath: '/tmp/.rnstorybook', enabled: true });
    expect(result.resolver.resolveRequest({}, mod, 'web')).not.toEqual({ type: 'empty' });
  });

  test.each(['os', 'tty'])('also replaces %s when storybook is disabled', (mod) => {
    const result = withStorybook(config, { configPath: '/tmp/.rnstorybook', enabled: false });
    const ctx = { resolveRequest };

    expect(result.resolver.resolveRequest(ctx, mod, 'ios')).toEqual({ type: 'empty' });
    expect(result.resolver.resolveRequest(ctx, mod, 'android')).toEqual({ type: 'empty' });
    expect(result.resolver.resolveRequest(ctx, mod, 'web')).not.toEqual({ type: 'empty' });
  });
});
