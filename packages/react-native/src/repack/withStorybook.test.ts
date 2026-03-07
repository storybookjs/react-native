import { StorybookPlugin } from './withStorybook';
import { createChannelServer } from '../metro/channelServer';

jest.mock('../metro/channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../../scripts/generate', () => ({
  generate: jest.fn(),
}));

const { generate } = require('../../scripts/generate') as typeof import('../../scripts/generate');

function createCompilerMock() {
  return {
    options: {
      resolve: {},
    },
    hooks: {
      beforeCompile: {
        tapPromise: jest.fn(),
      },
    },
    webpack: {
      NormalModuleReplacementPlugin: class NormalModuleReplacementPlugin {
        apply() {}
      },
    },
  };
}

describe('StorybookPlugin experimental_mcp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('starts MCP server when enabled without websockets', () => {
    const plugin = new StorybookPlugin({
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      experimental_mcp: true,
    });

    expect(() => plugin.apply(createCompilerMock() as any)).not.toThrow();
    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        experimental_mcp: true,
        websockets: false,
      })
    );
  });

  test('passes experimental_mcp to channel server when websockets are configured', () => {
    const plugin = new StorybookPlugin({
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      experimental_mcp: true,
      websockets: 'auto',
    });

    expect(() => plugin.apply(createCompilerMock() as any)).not.toThrow();
    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({ experimental_mcp: true, websockets: true })
    );
  });

  test('passes secure websocket options through to the channel server and generator', async () => {
    const compiler = createCompilerMock() as any;
    const plugin = new StorybookPlugin({
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

    plugin.apply(compiler);

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

    const beforeCompile = compiler.hooks.beforeCompile.tapPromise.mock.calls[0][1];
    await beforeCompile();

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
    const plugin = new StorybookPlugin({
      configPath: '/tmp/.rnstorybook',
      enabled: false,
      experimental_mcp: true,
    });

    expect(() => plugin.apply(createCompilerMock() as any)).not.toThrow();
  });
});
