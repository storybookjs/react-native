import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import { generate } from '../scripts/generate';
import { createChannelServer } from './metro/channelServer';
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
  const {
    configPath = path.resolve(process.cwd(), './.rnstorybook'),
    websockets,
    useJs = false,
    docTools = true,
    liteMode = false,
    experimental_mcp = false,
  } = options;

  if (websockets || experimental_mcp) {
    const port = websockets === 'auto' ? 7007 : (websockets?.port ?? 7007);
    const host = websockets === 'auto' ? 'auto' : websockets?.host;
    const secured = Boolean(websockets && websockets !== 'auto' && websockets.secured);

    createChannelServer({
      port,
      host: host === 'auto' ? undefined : host,
      configPath,
      experimental_mcp,
      websockets: Boolean(websockets),
      secured,
      ssl:
        websockets && websockets !== 'auto'
          ? {
              key: websockets.key,
              cert: websockets.cert,
              ca: websockets.ca,
              passphrase: websockets.passphrase,
            }
          : undefined,
    });

    if (websockets) {
      generate({ configPath, useJs, docTools, host, port, secured });
    } else {
      generate({ configPath, useJs, docTools });
    }
  } else {
    generate({ configPath, useJs, docTools });
  }

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
