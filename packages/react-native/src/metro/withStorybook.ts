import * as path from 'path';
import { generate } from '../../scripts/generate';
import type { MetroConfig } from 'metro-config';
import { optionalEnvToBoolean } from 'storybook/internal/common';
import { telemetry } from 'storybook/internal/telemetry';
import { createChannelServer } from './channelServer';
import type { WebsocketsOptions } from '../types';

/**
 * Options for configuring Storybook with React Native.
 */
interface WithStorybookOptions {
  /**
   * The path to the Storybook config folder. Defaults to './.rnstorybook'.
   */
  configPath?: string;

  /**
   * WebSocket configuration for syncing storybook instances or sending events to storybook.
   */
  websockets?: WebsocketsOptions | 'auto';

  /**
   * Whether to use JavaScript files for Storybook configuration instead of TypeScript. Defaults to false.
   */
  useJs?: boolean;

  /**
   * if false, we will attempt to remove storybook from the js bundle.
   */
  enabled?: boolean;

  /**
   * Whether to include doc tools in the storybook.requires file. Defaults to true.
   */
  docTools?: boolean;

  /**
   * Whether to use lite mode for the storybook. Defaults to false.
   * This will mock out the default storybook ui so you don't need to install all its dependencies like reanimated etc.
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

type ResolveRequestFunction = (context: any, moduleName: string, platform: string | null) => any;

/**
 * Configures Metro bundler to work with Storybook in React Native.
 * This function wraps a Metro configuration to enable Storybook usage.
 * This is intended to replace the withStorybook function in the future.
 *
 * @param config - The Metro bundler configuration to be modified. This should be a valid Metro config object
 *                 that includes resolver, transformer, and other Metro-specific options.
 * @param options - Options to customize the Storybook configuration.
 * @param options.configPath - The path to the Storybook config folder. Defaults to './.rnstorybook'.
 *                            This is where your main.js/ts and preview.js/ts files are located.
 * @param options.websockets - WebSocket configuration for syncing storybook instances or sending events.
 *                            When provided, creates a WebSocket server for real-time communication.
 * @param options.websockets.port - The port WebSocket server will listen on. Defaults to 7007.
 * @param options.websockets.host - The host WebSocket server will bind to. Defaults to 'localhost'.
 * @param options.websockets.secured - Whether to use WSS/HTTPS for the channel server.
 * @param options.websockets.key - TLS private key used when `secured` is true.
 * @param options.websockets.cert - TLS certificate used when `secured` is true.
 * @param options.useJs - Whether to use JavaScript files for Storybook configuration instead of TypeScript.
 *                       When true, generates storybook.requires.js instead of storybook.requires.ts.
 *                       Defaults to false.
 * @param options.enabled - If false, attempts to remove storybook modules from the JavaScript
 *                         bundle to reduce bundle size. Defaults to true.
 * @param options.docTools - Whether to include doc tools in the storybook.requires file.
 *                          Doc tools provide additional documentation features. Defaults to true.
 * @param options.liteMode - Whether to use lite mode for the storybook. In lite mode, the default
 *                          storybook UI is mocked out so you don't need to install all its dependencies
 *                          like reanimated etc. This is useful for reducing bundle size and dependencies.
 *                          Defaults to false.
 * @returns The modified Metro configuration with Storybook support enabled.
 *
 * @example
 * ```javascript
 * const { getDefaultConfig } = require('expo/metro-config');
 * const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
 * const path = require('path');
 *
 * const projectRoot = __dirname;
 * const config = getDefaultConfig(projectRoot);
 *
 * module.exports = withStorybook(config, {
 *   configPath: path.resolve(projectRoot, './.rnstorybook'),
 *   websockets: { port: 7007, host: 'localhost' },
 *   useJs: false,
 *   docTools: true,
 *   liteMode: false,
 * });
 * ```
 *
 * @example
 * ```javascript
 * // Minimal configuration
 * const { getDefaultConfig } = require('expo/metro-config');
 * const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
 *
 * const config = getDefaultConfig(__dirname);
 * module.exports = withStorybook(config);
 * ```
 *
 * @example
 * ```javascript
 * // Disable Storybook in production
 * const { getDefaultConfig } = require('expo/metro-config');
 * const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
 *
 * const config = getDefaultConfig(__dirname);
 * module.exports = withStorybook(config, {
 *   enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
 * });
 * ```
 */
export function withStorybook(
  config: MetroConfig,
  options: WithStorybookOptions = {
    useJs: false,
    enabled: true,
    docTools: true,
    liteMode: false,
    configPath: path.resolve(process.cwd(), './.rnstorybook'),
  }
): MetroConfig {
  const {
    configPath = path.resolve(process.cwd(), './.rnstorybook'),
    websockets,
    useJs = false,
    enabled = true,
    docTools = true,
    liteMode = false,
    experimental_mcp = false,
  } = options;

  const disableTelemetry = optionalEnvToBoolean(process.env.STORYBOOK_DISABLE_TELEMETRY);

  if (!disableTelemetry && enabled) {
    const event = process.env.NODE_ENV === 'production' ? 'build' : 'dev';

    telemetry(event, {}).catch((e) => {});
  }

  if (!enabled) {
    return {
      ...config,
      resolver: {
        ...config.resolver,
        resolveRequest: (context: any, moduleName: string, platform: string | null) => {
          const resolveFunction: ResolveRequestFunction = config?.resolver?.resolveRequest
            ? config.resolver.resolveRequest
            : context.resolveRequest;

          if (moduleName.startsWith('storybook') || moduleName.startsWith('@storybook')) {
            return {
              type: 'empty',
            };
          }

          // workaround for node imports in instrumentor.cjs
          if (moduleName === 'tty' || moduleName === 'os') {
            return {
              type: 'empty',
            };
          }

          const resolved = resolveFunction(context, moduleName, platform);

          // Match the config folder's index file regardless of extension (ts, tsx, js, jsx)
          const configIndexRegex = new RegExp(`${configPath}/index\\.(tsx?|jsx?)$`);
          if (resolved.filePath && configIndexRegex.test(resolved.filePath)) {
            return {
              filePath: path.resolve(__dirname, '../stub.js'),
              type: 'sourceFile',
            };
          }

          if (resolved.filePath?.includes?.(configPath)) {
            return { type: 'empty' };
          }

          return resolved;
        },
      },
    };
  }

  if (websockets || experimental_mcp) {
    const port = websockets === 'auto' ? 7007 : (websockets?.port ?? 7007);
    const host = websockets === 'auto' ? 'auto' : websockets?.host;
    const secured = Boolean(websockets && websockets !== 'auto' && websockets.secured);

    // note that in this case by passing an undefined host we only bind to the port and allow any connections i.e localhost, 127.0.0.1, 0.0.0.0, etc.
    // in the generate function we try to get the ip address from the os and write it to the requires file for easier lan connection
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

    if (websockets) {
      generate({
        configPath,
        useJs,
        docTools,
        host,
        port,
        secured,
      });
    } else {
      generate({
        configPath,
        useJs,
        docTools,
      });
    }
  } else {
    generate({
      configPath,
      useJs,
      docTools,
    });
  }

  return {
    ...config,
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext: true,
    },
    resolver: {
      ...config.resolver,
      resolveRequest: (context: any, moduleName: string, platform: string | null) => {
        const resolveFunction: ResolveRequestFunction = config?.resolver?.resolveRequest
          ? config.resolver.resolveRequest
          : context.resolveRequest;

        const shouldUseCustomResolveConfig =
          moduleName.startsWith('storybook') ||
          moduleName.startsWith('@storybook') ||
          moduleName.startsWith('uuid');

        const theContext = shouldUseCustomResolveConfig
          ? {
              ...context,
              unstable_enablePackageExports: true,
              unstable_conditionNames: ['import'],
            }
          : context;

        const resolveResult = resolveFunction(theContext, moduleName, platform);

        // Workaround for template files with invalid imports
        if (resolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return {
            type: 'empty',
          };
        }

        // workaround for node imports in instrumentor.cjs
        if (moduleName === 'tty' || moduleName === 'os') {
          return {
            type: 'empty',
          };
        }

        // to remove any dependencies of the storybook ui related to @storybook/react-native-ui
        if (
          liteMode &&
          resolveResult?.filePath?.includes?.('@storybook/react-native-ui') &&
          !resolveResult?.filePath?.includes?.('@storybook/react-native-ui-lite') &&
          !resolveResult?.filePath?.includes?.('@storybook/react-native-ui-common')
        ) {
          return {
            type: 'empty',
          };
        }

        return resolveResult;
      },
    },
  };
}
