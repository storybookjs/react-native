import * as path from 'path';
import { generate } from '../../scripts/generate';
import { createChannelServer } from '../metro/channelServer';
import type { WebsocketsOptions } from '../types';

/**
 * Minimal compiler types for webpack/rspack compatibility.
 * We define these inline to avoid requiring @rspack/core or webpack as dependencies.
 */
interface Compiler {
  options: {
    resolve: {
      alias?: Record<string, string | false>;
    };
  };
  hooks: {
    beforeCompile: {
      tapPromise: (name: string, fn: () => Promise<void>) => void;
    };
  };
  webpack: {
    NormalModuleReplacementPlugin: new (
      pattern: RegExp,
      fn: (resource: { request?: string }) => void
    ) => { apply: (compiler: Compiler) => void };
  };
}

/**
 * Options for configuring the Storybook Repack plugin.
 */
export interface StorybookPluginOptions {
  /**
   * The path to the Storybook config folder. Defaults to './.rnstorybook'.
   */
  configPath?: string;

  /**
   * If false, strips Storybook from the bundle. Defaults to true.
   */
  enabled?: boolean;

  /**
   * WebSocket configuration for syncing storybook instances or sending events to storybook.
   * When set to 'auto', uses port 7007 and auto-detects the host LAN IP address.
   */
  websockets?: WebsocketsOptions | 'auto';

  /**
   * Whether to use JavaScript files for Storybook configuration instead of TypeScript.
   * When true, generates storybook.requires.js instead of storybook.requires.ts.
   * Defaults to false.
   */
  useJs?: boolean;

  /**
   * Whether to include doc tools in the storybook.requires file.
   * Doc tools provide additional documentation features. Defaults to true.
   */
  docTools?: boolean;

  /**
   * Whether to use lite mode for the storybook. In lite mode, the default storybook UI
   * is mocked out so you don't need to install all its dependencies like reanimated etc.
   * Defaults to false.
   */
  liteMode?: boolean;

  /**
   * Whether to enable MCP (Model Context Protocol) server support. Defaults to false.
   * When enabled, adds an /mcp endpoint to the channel server,
   * allowing AI agents (Claude Code, Cursor, etc.) to query component documentation.
   * If websockets are disabled, MCP documentation tools still work but story selection is unavailable.
   */
  experimental_mcp?: boolean;
}

/**
 * Repack/Rspack plugin for React Native Storybook.
 *
 * Provides equivalent functionality to the Metro {@link withStorybook} wrapper:
 * - Auto-generates `storybook.requires.ts` before compilation
 * - Starts a WebSocket channel server for remote control / syncing
 * - Supports `enabled: false` to strip Storybook from the bundle
 * - Supports `liteMode` to mock out the full Storybook UI
 *
 * @example
 * ```javascript
 * import { StorybookPlugin } from '@storybook/react-native/repack/withStorybook';
 *
 * // In your rspack.config.mjs plugins array:
 * new StorybookPlugin({
 *   enabled: true,
 *   websockets: 'auto',
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Disable Storybook in production builds:
 * new StorybookPlugin({
 *   enabled: process.env.STORYBOOK_ENABLED !== 'false',
 *   websockets: 'auto',
 * })
 * ```
 */
export class StorybookPlugin {
  private options: Required<
    Pick<
      StorybookPluginOptions,
      'configPath' | 'enabled' | 'useJs' | 'docTools' | 'liteMode' | 'experimental_mcp'
    >
  > &
    Pick<StorybookPluginOptions, 'websockets'>;

  private generated = false;
  private serverStarted = false;

  constructor(options: StorybookPluginOptions = {}) {
    this.options = {
      configPath: path.resolve(process.cwd(), './.rnstorybook'),
      enabled: true,
      useJs: false,
      docTools: true,
      liteMode: false,
      experimental_mcp: false,
      ...options,
    };
  }

  apply(compiler: Compiler): void {
    const { configPath, enabled, websockets, useJs, docTools, liteMode, experimental_mcp } =
      this.options;

    if (!enabled) {
      this.applyDisabled(compiler, configPath);
      return;
    }

    this.applyEnabled(compiler, {
      configPath,
      websockets,
      useJs,
      docTools,
      liteMode,
      experimental_mcp,
    });
  }

  /**
   * When enabled: generate storybook.requires, optionally start websocket server,
   * and set up liteMode aliases.
   */
  private applyEnabled(
    compiler: Compiler,
    {
      configPath,
      websockets,
      useJs,
      docTools,
      liteMode,
      experimental_mcp,
    }: {
      configPath: string;
      websockets?: WebsocketsOptions | 'auto';
      useJs: boolean;
      docTools: boolean;
      liteMode: boolean;
      experimental_mcp: boolean;
    }
  ): void {
    const port = websockets === 'auto' ? 7007 : (websockets?.port ?? 7007);
    const host = websockets === 'auto' ? 'auto' : websockets?.host;
    const secured = Boolean(websockets && websockets !== 'auto' && websockets.secured);

    // Start the channel server once (on first apply, not per-compilation)
    if ((websockets || experimental_mcp) && !this.serverStarted) {
      this.serverStarted = true;

      createChannelServer({
        port,
        host: host === 'auto' ? undefined : host,
        configPath,
        experimental_mcp,
        websockets: Boolean(websockets),
        secured,
        ssl:
          websockets && websockets !== 'auto'
            ? {
                key: websockets.key,
                cert: websockets.cert,
                ca: websockets.ca,
                passphrase: websockets.passphrase,
              }
            : undefined,
      });
    }

    // Generate storybook.requires before first compilation
    compiler.hooks.beforeCompile.tapPromise('StorybookPlugin', async () => {
      if (this.generated) return;
      this.generated = true;

      await generate({
        configPath,
        useJs,
        docTools,
        ...(websockets ? { host, port, secured } : {}),
      });

      console.log('[StorybookPlugin] Generated storybook.requires');
    });

    // liteMode: alias @storybook/react-native-ui to false (empty module)
    // but keep @storybook/react-native-ui-lite and @storybook/react-native-ui-common
    if (liteMode) {
      const alias = compiler.options.resolve.alias ?? {};

      // rspack/webpack supports `false` as an alias value to produce an empty module.
      // The `$` suffix ensures exact match so -lite and -common variants are not affected.
      alias['@storybook/react-native-ui$'] = false;

      compiler.options.resolve.alias = alias;
    }
  }

  /**
   * When disabled: redirect all Storybook imports to empty modules,
   * and replace the config folder index with a stub component.
   */
  private applyDisabled(compiler: Compiler, configPath: string): void {
    const stubPath = path.resolve(
      __dirname,
      __dirname.includes(`${path.sep}src${path.sep}`) ? '../stub.tsx' : '../stub.js'
    );
    const normalizedConfigPath = path.resolve(configPath);

    // Use NormalModuleReplacementPlugin to intercept storybook module requests
    new compiler.webpack.NormalModuleReplacementPlugin(/./, (resource) => {
      const request = resource.request;
      if (!request) return;

      // Redirect all @storybook/* and storybook imports to the stub
      if (request.startsWith('@storybook') || request.startsWith('storybook')) {
        resource.request = stubPath;
        return;
      }
    }).apply(compiler);

    // Alias the config folder's index to the stub component
    const alias = compiler.options.resolve.alias ?? {};
    alias[normalizedConfigPath] = stubPath;
    compiler.options.resolve.alias = alias;
  }
}
