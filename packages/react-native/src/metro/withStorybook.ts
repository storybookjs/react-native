import * as path from 'path';
import { generate } from '../../scripts/generate';
import { networkInterfaces } from 'node:os';
import type { MetroConfig } from 'metro-config';
import { optionalEnvToBoolean } from 'storybook/internal/common';
import { telemetry } from 'storybook/internal/telemetry';
import { createChannelServer } from './channelServer';

/**
 * Get the local IP address of the machine.
 * @returns The local IP address of the machine.
 */
function getLocalIPAddress(): string | undefined {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0';
}
/**
 * Options for configuring WebSockets used for syncing storybook instances or sending events to storybook.
 */
interface WebsocketsOptions {
  /**
   * The port WebSocket server will listen on. Defaults to 7007.
   */
  port?: number;

  /**
   * The host WebSocket server will bind to. Defaults to 'localhost'.
   */
  host?: string;
}

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

          // TODO do i need to account for jsx/js/ts file
          if (resolved.filePath?.includes?.(`${configPath}/index.tsx`)) {
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

  let websocketOptions: WebsocketsOptions | undefined;

  if (websockets) {
    const port = websockets === 'auto' ? 7007 : (websockets.port ?? 7007);
    // note that in this case by passing an undefined host we only bind to the port and allow any connections i.e localhost, 127.0.0.1, 0.0.0.0, etc.
    const host = websockets === 'auto' ? undefined : websockets.host;

    websocketOptions = { port, host };

    createChannelServer({ port, host, configPath });
  }

  generate({
    configPath,
    useJs,
    docTools,
    // here we want to get the ip address so that devices can connect over lan
    host: websockets === 'auto' ? getLocalIPAddress() : websocketOptions?.host,
    port: websocketOptions?.port,
  });

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
