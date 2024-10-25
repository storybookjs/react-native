import type { InputConfigT } from 'metro-config';

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
export function withStorybook(config: InputConfigT, options?: WithStorybookOptions): InputConfigT;
