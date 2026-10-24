import * as path from 'path';
import { createRequire } from 'module';

/** Resolve `specifier` from `directory` the way Node does, or `undefined` when it is not there. */
export type ResolveFromDirectory = (directory: string, specifier: string) => string | undefined;

/**
 * Node's own resolution, anchored at a directory — how Metro sees `transformerPath` when
 * it loads a worker from inside its own package. `require.resolve` is avoided: bundlers
 * and test runners anchor it at this file instead of the directory being asked about.
 */
export const resolveFromDirectory: ResolveFromDirectory = (directory, specifier) => {
  try {
    return createRequire(path.join(directory, 'storybook-anchor.js')).resolve(specifier);
  } catch {
    return undefined;
  }
};

/**
 * The Metro that runs the bundle.
 *
 * `react-native` does not depend on Metro; its `@react-native/community-cli-plugin` does, and
 * the app cannot necessarily see either. Each lookup is anchored at the package that declares
 * the dependency, the only one that can reach it in an isolated install (pnpm without
 * hoisting, Yarn PnP). Metro next to the app comes last: Expo puts it there.
 */
function findMetroDirectory(
  projectRoot: string,
  resolveFrom: ResolveFromDirectory = resolveFromDirectory
): string | undefined {
  const reactNative = resolveFrom(projectRoot, 'react-native/package.json');
  if (reactNative) {
    const cliPlugin = resolveFrom(
      path.dirname(reactNative),
      '@react-native/community-cli-plugin/package.json'
    );
    if (cliPlugin) {
      const metroPackage = resolveFrom(path.dirname(cliPlugin), 'metro/package.json');
      if (metroPackage) {
        return path.dirname(metroPackage);
      }
    }
  }

  const fromProjectRoot = resolveFrom(projectRoot, 'metro/package.json');
  return fromProjectRoot ? path.dirname(fromProjectRoot) : undefined;
}

/**
 * The worker Storybook has to chain to, resolved the way Metro resolves it.
 *
 * A bare specifier — Metro's `metro-transform-worker` default — only means something from
 * inside Metro, which is not where this package finds it: a hoisted copy can be older than
 * the Metro that runs. Absolute paths (Expo, NativeWind and other wrappers naming their own
 * worker) are final. `undefined` means it is out of reach, which the caller has to survive:
 * Metro itself may be perfectly happy with it.
 */
export function resolveUpstreamTransformerPath(
  transformerPath: string,
  projectRoot: string,
  resolveFrom: ResolveFromDirectory = resolveFromDirectory
): string | undefined {
  if (path.isAbsolute(transformerPath)) {
    return transformerPath;
  }

  const metroDirectory = findMetroDirectory(projectRoot, resolveFrom);
  return metroDirectory === undefined ? undefined : resolveFrom(metroDirectory, transformerPath);
}
