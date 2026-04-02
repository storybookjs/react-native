import * as path from 'path';
import * as fs from 'fs';

export const ENTRY_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

export interface WithStorybookOptions {
  configPath?: string;
  websockets?: import('../types').WebsocketsOptions | 'auto';
  useJs?: boolean;
  enabled?: boolean;
  docTools?: boolean;
  liteMode?: boolean;
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
