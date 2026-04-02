import type { MetroConfig } from 'metro-config';
import { withStorybookSwap } from './metro/withStorybookSwap';
import { StorybookPlugin } from './repack/withStorybook';
import { applyWebsocketEnvOverrides } from './metro/withStorybook';
import type { WithStorybookOptions } from './metro/withStorybook';

/**
 * Detects whether the given config object is a Metro bundler configuration.
 * Metro configs are identified by the presence of a `transformer` property,
 * which is unique to Metro and not found in webpack/rspack configurations.
 */
function isMetroConfig(config: unknown): config is MetroConfig {
  return config != null && typeof config === 'object' && 'transformer' in config;
}

/**
 * Universal Storybook config wrapper that works with both Metro and Repack (webpack/rspack).
 *
 * Automatically detects the bundler type from the config object and applies the
 * appropriate Storybook integration:
 *
 * - **Metro**: Applies Storybook Metro configuration including entry-point swapping
 *   (when `STORYBOOK_ENABLED=true`) and WebSocket env variable overrides.
 * - **Repack/Rspack/Webpack**: Adds a `StorybookPlugin` to the config's `plugins` array
 *   with WebSocket env variable overrides applied.
 *
 * @param config - The bundler configuration (Metro or Rspack/Webpack).
 * @param options - Options to customize Storybook behavior.
 * @returns The modified config with Storybook support enabled.
 *
 * @example
 * ```javascript
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config');
 * const { withStorybook } = require('@storybook/react-native/withStorybook');
 *
 * const config = getDefaultConfig(__dirname);
 * module.exports = withStorybook(config);
 * ```
 *
 * @example
 * ```javascript
 * // rspack.config.mjs
 * import { withStorybook } from '@storybook/react-native/withStorybook';
 *
 * export default withStorybook({
 *   entry: './index.js',
 *   plugins: [],
 * });
 * ```
 */
export function withStorybook<T>(config: T, options: WithStorybookOptions = {}): T {
  if (isMetroConfig(config)) {
    return withStorybookSwap(config, options) as unknown as T;
  }

  // Repack/webpack/rspack path: apply ws env overrides and add StorybookPlugin
  const websockets = applyWebsocketEnvOverrides(options.websockets);
  const repackOptions = { ...options, ...(websockets !== undefined ? { websockets } : {}) };

  const bundlerConfig = config as Record<string, any>;

  return {
    ...bundlerConfig,
    plugins: [...(bundlerConfig.plugins || []), new StorybookPlugin(repackOptions)],
  } as T;
}
