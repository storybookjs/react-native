import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import type { ResolveRequestFunction } from './metro/utils';

interface EnhanceMetroOptions {
  liteMode?: boolean;
  swap?: {
    appEntryPoint: string;
    storybookEntryPoint: string;
  };
}

export function enhanceMetroConfig(
  config: MetroConfig,
  options: EnhanceMetroOptions = {}
): MetroConfig {
  const { liteMode = false, swap } = options;

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

        if (resolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return { type: 'empty' };
        }

        if (moduleName === 'tty' || moduleName === 'os') {
          return { type: 'empty' };
        }

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
