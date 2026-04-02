import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import { withStorybook as baseWithStorybook } from './metro/withStorybook';
import type { WithStorybookOptions, ResolveRequestFunction } from './metro/utils';

interface EntrySwap {
  appEntryPoint: string;
  storybookEntryPoint: string;
}

export function enhanceMetroConfig(
  config: MetroConfig,
  options: WithStorybookOptions,
  swap?: EntrySwap
): MetroConfig {
  const result = baseWithStorybook(config, { ...options, enabled: true });

  if (!swap) {
    return result;
  }

  const { appEntryPoint, storybookEntryPoint } = swap;
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
