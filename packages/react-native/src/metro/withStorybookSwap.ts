import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import {
  withStorybook,
  resolveEntryPoint,
  resolveStorybookEntry,
  applyWebsocketEnvOverrides,
} from './withStorybook';
import type { WithStorybookOptions, ResolveRequestFunction } from './withStorybook';

export { resolveEntryPoint, resolveStorybookEntry, applyWebsocketEnvOverrides };

/**
 * Configures Metro bundler to work with Storybook using entry-point swapping.
 *
 * This wrapper extends {@link withStorybook} with two additional features:
 *
 * 1. **Entry-point swapping**: When `STORYBOOK_ENABLED=true` is set as an environment
 *    variable, the Metro resolver redirects the application entry point to the Storybook
 *    config entry (`.rnstorybook/index`). This allows Storybook to run as a separate
 *    development entry point without modifying application code.
 *
 * 2. **WebSocket environment variable overrides**: WebSocket configuration can be
 *    overridden via environment variables (`STORYBOOK_WS_HOST`, `STORYBOOK_WS_PORT`,
 *    `STORYBOOK_WS_SECURED`), which take precedence over options passed in code.
 *
 * For backwards-compatible behavior without entry-point swapping, use {@link withStorybook}.
 *
 * @param config - The Metro bundler configuration to be modified.
 * @param options - Options to customize the Storybook configuration (same as withStorybook).
 * @returns The modified Metro configuration with Storybook support and entry-point swapping.
 *
 * @example
 * ```javascript
 * const { getDefaultConfig } = require('expo/metro-config');
 * const { withStorybookSwap } = require('@storybook/react-native/metro/withStorybookSwap');
 *
 * const config = getDefaultConfig(__dirname);
 * // Run with: STORYBOOK_ENABLED=true npx expo start
 * module.exports = withStorybookSwap(config);
 * ```
 */
export function withStorybookSwap(
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
    enabled = true,
  } = options;

  // Apply websocket env variable overrides before passing to withStorybook
  const websockets = applyWebsocketEnvOverrides(options.websockets);
  const optionsWithWsOverrides = { ...options, websockets };

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

  // Delegate to the base withStorybook for core configuration
  const result = withStorybook(config, optionsWithWsOverrides);

  // If entry-point swapping is not active, return the base result as-is
  if (!storybookEnabled || !appEntryPoint || !storybookEntryPoint || !enabled) {
    return result;
  }

  // Wrap the resolver to add entry-point swapping
  const baseResolveRequest = result.resolver?.resolveRequest;

  return {
    ...result,
    resolver: {
      ...result.resolver,
      resolveRequest: (context: any, moduleName: string, platform: string | null) => {
        const resolveFunction: ResolveRequestFunction = baseResolveRequest
          ? baseResolveRequest
          : config?.resolver?.resolveRequest
            ? config.resolver.resolveRequest
            : context.resolveRequest;

        const resolveResult = resolveFunction(context, moduleName, platform);

        // Entry-point swapping: redirect the app entry to the storybook entry
        if (
          resolveResult?.filePath &&
          path.resolve(resolveResult.filePath) === appEntryPoint
        ) {
          return {
            filePath: storybookEntryPoint,
            type: 'sourceFile',
          };
        }

        return resolveResult;
      },
    },
  };
}
