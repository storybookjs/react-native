import * as path from 'path';

import { generate } from '../../scripts/generate';
import { WebSocketServer, WebSocket, Data } from 'ws';
import type { MetroConfig } from 'metro-config';
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
   * The path to the Storybook config folder. Defaults to './.storybook'.
   */
  configPath?: string;

  /**
   * Whether Storybook is enabled. Defaults to true.
   */
  enabled?: boolean;

  /**
   * WebSocket configuration for syncing storybook instances or sending events to storybook.
   */
  websockets?: WebsocketsOptions;

  /**
   * Whether to use JavaScript files for Storybook configuration instead of TypeScript. Defaults to false.
   */
  useJs?: boolean;

  /**
   * If enabled is false and onDisabledRemoveStorybook is true, we will attempt to remove storybook from the js bundle.
   */
  onDisabledRemoveStorybook?: boolean;
}

type ResolveRequestFunction = (context: any, moduleName: string, platform: string | null) => any;

/**
 * Configures Metro bundler to work with Storybook in React Native.
 * This function wraps a Metro configuration to enable Storybook usage.
 *
 * @param config - The Metro bundler configuration to be modified.
 * @param options - Options to customize the Storybook configuration.
 * @returns The modified Metro configuration.
 *
 * @example
 * const { getDefaultConfig } = require('expo/metro-config');
 * const withStorybook = require('@storybook/react-native/metro/withStorybook');
 * const path = require('path');
 *
 * const projectRoot = __dirname;
 * const config = getDefaultConfig(projectRoot);
 *
 * module.exports = withStorybook(config, {
 *   enabled: true,
 *   configPath: path.resolve(projectRoot, './.storybook'),
 *   websockets: { port: 7007, host: 'localhost' },
 *   useJs: false,
 *   onDisabledRemoveStorybook: true,
 * });
 */
function withStorybook(
  config: MetroConfig,
  options: WithStorybookOptions = {
    enabled: true,
    useJs: false,
    onDisabledRemoveStorybook: false,
  }
): MetroConfig {
  const {
    configPath,
    enabled = true,
    websockets,
    useJs = false,
    onDisabledRemoveStorybook = false,
  } = options;

  if (!enabled) {
    if (onDisabledRemoveStorybook) {
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

            return resolveFunction(context, moduleName, platform);
          },
        },
      };
    }

    return config;
  }

  if (websockets) {
    const port = websockets.port ?? 7007;
    const host = websockets.host ?? 'localhost';

    const wss = new WebSocketServer({ port, host });

    wss.on('connection', function connection(ws: WebSocket) {
      console.log('WebSocket connection established');

      ws.on('error', console.error);

      ws.on('message', function message(data: Data) {
        try {
          const json = JSON.parse(data.toString());

          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  generate({
    configPath: configPath ?? path.resolve(process.cwd(), './.storybook'),
    useJs,
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

        const isStorybookModule =
          moduleName.startsWith('storybook') || moduleName.startsWith('@storybook');

        const theContext = isStorybookModule
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

        return resolveResult;
      },
    },
  };
}

export = withStorybook;
