import type { MetroConfig } from 'metro-config';
import { createChannelServer } from './channelServer';
import { generate } from '../../scripts/generate';

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
});
