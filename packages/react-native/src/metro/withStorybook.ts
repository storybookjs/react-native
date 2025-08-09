import * as path from 'path';
import { generate } from '../../scripts/generate';

import type { MetroConfig } from 'metro-config';
import { setupWebsocketServer } from '../webserver/webserver';

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

  /**
   * The device ID to use for test events over the WebSocket server.
   */
  deviceId?: string;
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
 *   configPath: path.resolve(projectRoot, './.rnstorybook'),
 *   websockets: { port: 7007, host: 'localhost' },
 *   useJs: false,
 *   docTools: true,
 *   onDisabledRemoveStorybook: true,
 * });
 */
function withStorybook(
  config: MetroConfig,
  options: WithStorybookOptions = {
    enabled: true,
    useJs: false,
    onDisabledRemoveStorybook: false,
    docTools: true,
    liteMode: false,
  }
): MetroConfig {
  const {
    configPath,
    enabled = true,
    websockets,
    useJs = false,
    onDisabledRemoveStorybook = false,
    docTools = true,
    liteMode = false,
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
    const deviceId = websockets.deviceId;

    setupWebsocketServer({ port, host, deviceId });
  }

  generate({
    configPath: configPath ?? path.resolve(process.cwd(), './.rnstorybook'),
    useJs,
    docTools,
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

export = withStorybook;
