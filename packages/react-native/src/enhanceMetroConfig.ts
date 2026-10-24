import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import type { ResolveRequestFunction } from './metro/utils';
import type { StorybookEntrySwap } from './metro/storybookTransformWorker';
import { resolveUpstreamTransformerPath } from './metro/resolveMetroWorker';

interface EnhanceMetroOptions {
  swap?: {
    appEntryPoint: string;
    storybookEntryPoint: string;
  };
  /**
   * When true, removes the default Storybook UI (`@storybook/react-native-ui`)
   * from the bundle so it can be used without its full dependency set.
   * The `-lite` and `-common` variants remain available.
   */
  liteMode?: boolean;
}

/** Metro's default transformer worker, used when the incoming config does not name one. */
const DEFAULT_TRANSFORMER_PATH = 'metro-transform-worker';

/**
 * Storybook's own worker. It sits next to this file in `src` and in `dist`, and only the
 * `withStorybook` entry point reaches `enhanceMetroConfig` from either of them.
 */
function findStorybookTransformWorker(): string | undefined {
  try {
    return require.resolve('./metro/storybookTransformWorker');
  } catch {
    return undefined;
  }
}

function sameFile(configuredPath: string, resolvedPath: string): boolean {
  return path.resolve(configuredPath) === path.resolve(resolvedPath);
}

/** What has to be added to the config to make Metro run Storybook's worker. */
interface TransformSwap {
  transformerPath: string;
  storybookEntrySwap: StorybookEntrySwap;
}

/**
 * Say that bundling will not swap entries, without breaking the config: Metro may be happy
 * with the worker it was given, and the dev server resolves the swap on its own.
 */
function warnNoBundleSwap(worker: string): void {
  console.warn(
    `Storybook could not resolve ${worker}, so entry-point swapping only applies to the dev ` +
      'server: `react-native bundle` and release builds will bundle the app instead of Storybook.'
  );
}

/**
 * Pair Storybook's worker with the worker it has to chain to, or `undefined` when
 * either of them cannot be found.
 */
function resolveEntrySwap(
  config: MetroConfig,
  swap: NonNullable<EnhanceMetroOptions['swap']>,
  projectRoot: string
): TransformSwap | undefined {
  const storybookWorker = findStorybookTransformWorker();
  const configuredPath = config.transformerPath ?? DEFAULT_TRANSFORMER_PATH;

  if (!storybookWorker) {
    warnNoBundleSwap("Storybook's own Metro transform worker (`./metro/storybookTransformWorker`)");
    return undefined;
  }

  const alreadySwapped = sameFile(configuredPath, storybookWorker);
  const existingSwap = (
    config.transformer as { storybookEntrySwap?: StorybookEntrySwap } | undefined
  )?.storybookEntrySwap;

  // `withStorybook` applied twice: the swap the first pass left behind names the
  // worker Storybook replaced, and chaining to ourselves would loop forever.
  if (alreadySwapped && existingSwap?.upstreamTransformerPath) {
    return {
      transformerPath: storybookWorker,
      storybookEntrySwap: {
        ...swap,
        upstreamTransformerPath: existingSwap.upstreamTransformerPath,
      },
    };
  }

  // Already swapped without a swap to learn from — a hand-copied config — so the
  // previous worker is unknown and Metro's default is the one that cannot be ours.
  const upstreamTransformerPath = resolveUpstreamTransformerPath(
    alreadySwapped ? DEFAULT_TRANSFORMER_PATH : configuredPath,
    projectRoot
  );

  if (!upstreamTransformerPath) {
    warnNoBundleSwap(`the Metro transformer worker \`${configuredPath}\``);
    return undefined;
  }

  return {
    transformerPath: storybookWorker,
    storybookEntrySwap: { ...swap, upstreamTransformerPath },
  };
}

export function enhanceMetroConfig(
  config: MetroConfig,
  options: EnhanceMetroOptions = {}
): MetroConfig {
  const { swap, liteMode = false } = options;

  const entrySwap: TransformSwap | undefined = swap
    ? resolveEntrySwap(config, swap, config.projectRoot ?? process.cwd())
    : undefined;

  return {
    ...config,
    // `react-native bundle` resolves the entry itself rather than asking `resolveRequest`, so
    // the swap has to happen at transform time too; the dev server keeps the resolver below.
    ...(entrySwap ? { transformerPath: entrySwap.transformerPath } : null),
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext: true,
      ...(entrySwap ? { storybookEntrySwap: entrySwap.storybookEntrySwap } : null),
    },
    resolver: {
      ...config.resolver,
      resolveRequest: (context: any, moduleName: string, platform: string | null) => {
        if (platform !== 'web' && (moduleName === 'tty' || moduleName === 'os')) {
          return { type: 'empty' };
        }

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

        if (resolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return { type: 'empty' };
        }

        // liteMode: remove the default storybook UI from the bundle, but
        // keep the -lite and -common variants which provide the minimal UI.
        if (
          liteMode &&
          resolveResult?.filePath?.includes?.('@storybook/react-native-ui') &&
          !resolveResult?.filePath?.includes?.('@storybook/react-native-ui-lite') &&
          !resolveResult?.filePath?.includes?.('@storybook/react-native-ui-common')
        ) {
          return { type: 'empty' };
        }

        // Entry-point swapping
        if (
          swap &&
          resolveResult?.filePath &&
          path.resolve(resolveResult.filePath) === swap.appEntryPoint
        ) {
          return {
            filePath: swap.storybookEntryPoint,
            type: 'sourceFile',
          };
        }

        return resolveResult;
      },
    },
  };
}
