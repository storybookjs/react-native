import { StorybookPlugin } from './withStorybook';
import { createChannelServer } from '../metro/channelServer';

jest.mock('../metro/channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../../scripts/generate', () => ({
  generate: jest.fn(),
}));

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

  test('does not throw when storybook is disabled', () => {
    const plugin = new StorybookPlugin({
      configPath: '/tmp/.rnstorybook',
      enabled: false,
      experimental_mcp: true,
    });

    expect(() => plugin.apply(createCompilerMock() as any)).not.toThrow();
  });
});
