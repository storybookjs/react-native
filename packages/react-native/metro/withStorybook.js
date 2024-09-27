const path = require('path');

const { generate } = require('../scripts/generate');
const { WebSocketServer } = require('ws');

module.exports = (
  config,
  { configPath, enabled = true, websockets, useJs = false } = { enabled: true, useJs: false }
) => {
  if (!enabled) {
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
      unstable_enablePackageExports: true,
      resolveRequest: (context, moduleName, platform) => {
        const defaultResolveResult = config?.resolver?.resolveRequest
          ? config?.resolver?.resolveRequest?.(context, moduleName, platform)
          : context.resolveRequest(context, moduleName, platform);

        // workaround for template files with invalid imports
        if (defaultResolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return {
            type: 'empty',
          };
        }

        return defaultResolveResult;
      },
    },
  };
};
