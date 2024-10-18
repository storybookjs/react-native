const path = require('path');

const { generate } = require('../scripts/generate');
const { WebSocketServer } = require('ws');

module.exports = (
  config,
  { configPath, enabled = true, websockets, useJs = false, onDisabledRemoveStorybook = false } = {
    enabled: true,
    useJs: false,
    onDisabledRemoveStorybook: false,
  }
) => {
  if (!enabled) {
    if (onDisabledRemoveStorybook) {
      return {
        ...config,
        resolver: {
          ...config.resolver,
          resolveRequest: (context, moduleName, platform) => {
            const resolveFunction = config?.resolver?.resolveRequest
              ? config?.resolver?.resolveRequest
              : context.resolveRequest;

            if (moduleName.startsWith('storybook') || moduleName.startsWith('@storybook')) {
              return {
                type: 'empty',
              };
            }

            return resolveFunction(context, moduleName, platform);
          },
        },
      };
    }

    return config;
  }

  if (websockets) {
    const port = websockets.port ?? 7007;

    const host = websockets.host ?? 'localhost';

    const wss = new WebSocketServer({ port, host });

    wss.on('connection', function connection(ws) {
      console.log('websocket connection established');

      ws.on('error', console.error);

      ws.on('message', function message(data) {
        try {
          const json = JSON.parse(data.toString());

          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  generate({
    configPath: configPath ?? path.resolve(process.cwd(), './.storybook'),
    useJs,
  });

  return {
    ...config,
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext: true,
    },
    resolver: {
      ...config.resolver,
      resolveRequest: (context, moduleName, platform) => {
        const resolveFunction = config?.resolver?.resolveRequest
          ? config?.resolver?.resolveRequest
          : context.resolveRequest;

        const isStorybookModule =
          moduleName.startsWith('storybook') || moduleName.startsWith('@storybook');

        const theContext = isStorybookModule
          ? {
              ...context,
              unstable_enablePackageExports: true,
              unstable_conditionNames: ['import'],
            }
          : context;

        const resolveResult = resolveFunction(theContext, moduleName, platform);

        // workaround for template files with invalid imports
        if (resolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return {
            type: 'empty',
          };
        }

        return resolveResult;
      },
    },
  };
};
