import * as path from 'path';

/** Entry-point swap, handed to the worker through `config.transformer.storybookEntrySwap`. */
export interface StorybookEntrySwap {
  /** Absolute path of the application entry point Metro was asked to bundle. */
  appEntryPoint: string;
  /** Absolute path of the Storybook entry point it is swapped for. */
  storybookEntryPoint: string;
  /** The worker Storybook replaced, which still transforms every file. */
  upstreamTransformerPath: string;
}

/** The transformer config as Metro delivers it, plus the key Storybook adds. */
export interface StorybookTransformWorkerConfig {
  storybookEntrySwap?: StorybookEntrySwap;
  [key: string]: unknown;
}

interface UpstreamTransformer {
  transform: (
    config: any,
    projectRoot: string,
    filename: string,
    data: Buffer,
    options: any
  ) => Promise<unknown>;
  getCacheKey?: (config: any, opts: { projectRoot?: string } | undefined) => string;
}

/**
 * The worker configured before Storybook, which transforms every file. Both halves of the
 * swap travel together, so a worker without a swap description is a misconfiguration:
 * falling back to Metro's default would quietly drop the swap, and any wrapper in front of
 * it such as Expo's.
 */
function loadUpstreamTransformer(config: StorybookTransformWorkerConfig): {
  transformer: UpstreamTransformer;
  transformerPath: string;
  swap: StorybookEntrySwap;
} {
  const swap = config.storybookEntrySwap;

  if (!swap) {
    throw new Error(
      'The Storybook Metro transform worker is configured as `transformerPath` but ' +
        '`transformer.storybookEntrySwap` is missing, so it does not know which entry point to swap ' +
        'or which worker to hand every other file to. Both keys are set together by `withStorybook`; ' +
        'point `transformerPath` back at your previous worker to get rid of this error.'
    );
  }

  const transformerPath = swap.upstreamTransformerPath;
  const transformer = require(transformerPath) as UpstreamTransformer;

  if (typeof transformer.transform !== 'function') {
    throw new Error(
      `Storybook cannot chain to the Metro transformer worker at \`${transformerPath}\`: ` +
        'it does not export a `transform` function.'
    );
  }

  return { transformer, transformerPath, swap };
}

/** The config as the upstream worker would have received it without Storybook in the middle. */
function withoutStorybookKey(
  config: StorybookTransformWorkerConfig
): StorybookTransformWorkerConfig {
  if (config.storybookEntrySwap === undefined) {
    return config;
  }

  const { storybookEntrySwap, ...rest } = config;
  return rest;
}

/** Backslashes only mean anything to a Windows path implementation. */
function toPosix(quotedPath: string, pathImpl: typeof path): string {
  return pathImpl.sep === '\\' ? quotedPath.split('\\').join('/') : quotedPath;
}

/**
 * `path.relative` from `fromDirectory` to `targetPath` as a module specifier. Windows paths
 * on another drive have no relative path — `path.win32.relative` answers with an absolute
 * path there, which is used as-is.
 */
function relativeModuleSpecifier(
  fromDirectory: string,
  targetPath: string,
  pathImpl: typeof path
): string {
  const relative = toPosix(pathImpl.relative(fromDirectory, targetPath), pathImpl);

  if (pathImpl.isAbsolute(relative)) {
    return toPosix(targetPath, pathImpl);
  }

  // A hidden sibling folder comes back as `.rnstorybook/index.tsx`, which is not a
  // relative module specifier Metro will resolve.
  return relative.startsWith('./') || relative.startsWith('../') ? relative : `./${relative}`;
}

/** `targetPath` relative to `projectRoot` where possible, so keys are not machine-specific. */
function cacheKeyPath(targetPath: string, projectRoot: string | undefined): string {
  if (!projectRoot) {
    return targetPath;
  }

  const relative = path.relative(projectRoot, targetPath);
  return path.isAbsolute(relative) ? toPosix(targetPath, path) : toPosix(relative, path);
}

function isAppEntryPoint(filename: string, projectRoot: string, appEntryPoint: string): boolean {
  return path.resolve(projectRoot, filename) === path.resolve(appEntryPoint);
}

/**
 * Source that replaces the application entry: it pulls in the Storybook entry, so Storybook
 * registers itself where the app used to.
 */
export function storybookEntrySource(
  appEntryPoint: string,
  storybookEntryPoint: string,
  pathImpl: typeof path = path
): string {
  const specifier = relativeModuleSpecifier(
    pathImpl.dirname(appEntryPoint),
    storybookEntryPoint,
    pathImpl
  );

  return (
    '// Injected by Storybook: the application entry point is swapped for the Storybook entry.\n' +
    `require(${JSON.stringify(specifier)});\n`
  );
}

/**
 * Transformer worker that swaps the application entry point for the Storybook one.
 *
 * The resolver swap in `enhanceMetroConfig` only covers entries Metro asks `resolveRequest`
 * about, which is how the dev server resolves them. `react-native bundle` — run by Xcode's
 * and Gradle's bundling phases too — resolves the entry itself, so the swap never happens
 * there and a Storybook-enabled release build ships the app. Rewriting at transform time
 * covers every bundler path, and the worker Storybook replaced still handles every other file.
 */
export async function transform(
  config: StorybookTransformWorkerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: any
): Promise<unknown> {
  const { transformer, swap } = loadUpstreamTransformer(config);

  if (options?.type !== 'asset' && isAppEntryPoint(filename, projectRoot, swap.appEntryPoint)) {
    data = Buffer.from(storybookEntrySource(swap.appEntryPoint, swap.storybookEntryPoint), 'utf8');
  }

  return transformer.transform(withoutStorybookKey(config), projectRoot, filename, data, options);
}

/**
 * Cache key for the whole transformer, which Metro folds into every per-file transform key
 * alongside the filename and the sha1 of the file on disk — a swapped entry would score the
 * same key as an unswapped one, so the swap has to show up here. Metro hashes the worker file
 * too, so a Storybook upgrade invalidates these keys by itself.
 */
export function getCacheKey(
  config: StorybookTransformWorkerConfig,
  opts?: { projectRoot?: string }
): string {
  const { transformer, transformerPath, swap } = loadUpstreamTransformer(config);
  const upstreamKey = transformer.getCacheKey
    ? transformer.getCacheKey(withoutStorybookKey(config), opts)
    : '';
  const projectRoot = opts?.projectRoot;

  return [
    'storybook-entry-swap',
    cacheKeyPath(transformerPath, projectRoot),
    `${cacheKeyPath(swap.appEntryPoint, projectRoot)}$${cacheKeyPath(swap.storybookEntryPoint, projectRoot)}`,
    upstreamKey,
  ].join('$');
}
