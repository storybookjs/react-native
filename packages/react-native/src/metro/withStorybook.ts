import * as path from 'path';
import * as fs from 'fs';
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

const ENTRY_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

/**
 * Resolves the application entry point for entry-point swapping.
 *
 * Detection order:
 * 1. Expo Router: checks for `expo-router` in package.json dependencies and
 *    looks for `expo-router/entry` as the main field.
 * 2. Expo / RN CLI: reads `package.json#main` and resolves it relative to the project root.
 * 3. Fallback: defaults to `index.js` in the project root.
 *
 * @param projectRoot - The root directory of the React Native project. Defaults to `process.cwd()`.
 * @returns The absolute path to the resolved application entry point, or `undefined` if no entry file exists.
 */
export function resolveEntryPoint(projectRoot: string = process.cwd()): string | undefined {
  const pkgJsonPath = path.resolve(projectRoot, 'package.json');

  let mainField: string | undefined;

  try {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    mainField = pkgJson.main;

    // Expo Router detection: if main points to expo-router/entry, resolve from node_modules
    if (mainField === 'expo-router/entry') {
      const expoRouterEntry = resolveFileWithExtensions(
        path.resolve(projectRoot, 'node_modules', 'expo-router', 'entry'),
        ENTRY_EXTENSIONS
      );

      if (expoRouterEntry) {
        return expoRouterEntry;
      }
    }
  } catch {
    // package.json not found or unreadable — continue with defaults
  }

  // Resolve the main field if present
  if (mainField && mainField !== 'expo-router/entry') {
    const resolved = resolveFileWithExtensions(
      path.resolve(projectRoot, mainField),
      ENTRY_EXTENSIONS
    );

    if (resolved) {
      return resolved;
    }
  }

  // Fallback: index.js in project root (standard RN CLI convention)
  const fallback = resolveFileWithExtensions(
    path.resolve(projectRoot, 'index'),
    ENTRY_EXTENSIONS
  );

  return fallback;
}

/**
 * Resolves a file path by trying the given path as-is first, then appending each
 * of the provided extensions. Returns the first path that exists on disk, or undefined.
 */
function resolveFileWithExtensions(
  basePath: string,
  extensions: string[]
): string | undefined {
  // Try the path as-is (might already have an extension)
  try {
    if (fs.statSync(basePath).isFile()) {
      return basePath;
    }
  } catch {
    // Path doesn't exist or is inaccessible — try extensions
  }

  for (const ext of extensions) {
    const candidate = `${basePath}.${ext}`;

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

/**
 * Resolves the Storybook config entry point (the file that will replace the app entry).
 * Looks for index.(ts|tsx|js|jsx) in the config folder.
 */
function resolveStorybookEntry(configPath: string): string | undefined {
  return resolveFileWithExtensions(
    path.resolve(configPath, 'index'),
    ENTRY_EXTENSIONS
  );
}

/**
 * Reads websocket configuration from environment variables, merging with any
 * provided options. Environment variables take precedence.
 *
 * Supported environment variables:
 * - STORYBOOK_WS_HOST: WebSocket server host
 * - STORYBOOK_WS_PORT: WebSocket server port
 * - STORYBOOK_WS_SECURED: Whether to use WSS (true/false)
 */
function applyWebsocketEnvOverrides(
  websockets: WebsocketsOptions | 'auto' | undefined
): WebsocketsOptions | 'auto' | undefined {
  const envHost = process.env.STORYBOOK_WS_HOST;
  const envPort = process.env.STORYBOOK_WS_PORT;
  const envSecured = process.env.STORYBOOK_WS_SECURED;

  // If no env overrides are set, return original value unchanged
  if (!envHost && !envPort && !envSecured) {
    return websockets;
  }

  // Start from existing config or empty object
  const base: WebsocketsOptions =
    websockets === 'auto' || websockets === undefined ? {} : { ...websockets };

  if (envHost) {
    base.host = envHost;
  }

  if (envPort) {
    const parsed = parseInt(envPort, 10);

    if (!isNaN(parsed)) {
      base.port = parsed;
    }
  }

  if (envSecured) {
    base.secured = envSecured === 'true';
  }

  return base;
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
    useJs = false,
    enabled = true,
    docTools = true,
    liteMode = false,
    experimental_mcp = false,
  } = options;

  // Apply websocket env variable overrides
  const websockets = applyWebsocketEnvOverrides(options.websockets);

  const disableTelemetry = optionalEnvToBoolean(process.env.STORYBOOK_DISABLE_TELEMETRY);

  if (!disableTelemetry && enabled) {
    const event = process.env.NODE_ENV === 'production' ? 'build' : 'dev';

    telemetry(event, {}).catch((e) => {});
  }

  // Determine if entry-point swapping is active.
  // This is gated behind the STORYBOOK_ENABLED env variable.
  const storybookEnabled = process.env.STORYBOOK_ENABLED === 'true';

  // Resolve entry points for swapping (only when storybook is actively enabled)
  let appEntryPoint: string | undefined;
  let storybookEntryPoint: string | undefined;

  if (storybookEnabled && enabled) {
    appEntryPoint = resolveEntryPoint();
    storybookEntryPoint = resolveStorybookEntry(configPath);
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

        // Entry-point swapping: when STORYBOOK_ENABLED is set, redirect the app entry to the storybook entry
        if (
          storybookEnabled &&
          appEntryPoint &&
          storybookEntryPoint &&
          resolveResult?.filePath &&
          path.resolve(resolveResult.filePath) === appEntryPoint
        ) {
          return {
            filePath: storybookEntryPoint,
            type: 'sourceFile',
          };
        }

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
