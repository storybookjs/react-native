import * as path from 'path';
import * as fs from 'fs';
import type { WebsocketsOptions } from '../types';

export const ENTRY_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

/**
 * Options for configuring Storybook with React Native.
 * Shared between the unified wrapper and the metro-specific wrappers.
 */
export interface WithStorybookOptions {
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

export type ResolveRequestFunction = (
  context: any,
  moduleName: string,
  platform: string | null
) => any;

/**
 * Resolves the application entry point for entry-point swapping.
 *
 * Detection order:
 * 1. Expo Router: checks for `expo-router/entry` as the main field in package.json
 *    and resolves it from node_modules.
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
export function resolveFileWithExtensions(
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
export function resolveStorybookEntry(configPath: string): string | undefined {
  return resolveFileWithExtensions(path.resolve(configPath, 'index'), ENTRY_EXTENSIONS);
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
export function applyWebsocketEnvOverrides(
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
