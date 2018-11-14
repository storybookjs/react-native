import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';
import { logger } from '@storybook/node-logger';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { getMiddleware } from './utils/middleware';

import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

let webpackResolve = () => {};
let webpackReject = () => {};

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default async function(options) {
  const configDir = path.resolve(options.configDir);
  const outputDir = path.resolve(options.outputDir || path.join(__dirname, '..', 'public'));
  const configType = 'DEVELOPMENT';

  const managerStartTime = process.hrtime();

  const managerConfig = await loadManagerConfig({
    configType,
    outputDir,
    configDir,
    corePresets: [require.resolve('./manager/manager-preset.js')],
  });

  const iframeConfig = await loadConfig({
    configType,
    outputDir,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
    ...options,
  });

  const managerPromise = new Promise((res, rej) => {
    webpack(managerConfig).watch({}, (err, stats) => {
      const managerTotalTime = process.hrtime(managerStartTime);
      logger.trace({ message: 'manager built', time: managerTotalTime });

      if (stats.hasErrors()) {
        rej(stats);
      } else {
        res(stats);
      }
    });
  });

  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let { publicPath } = iframeConfig.output;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const iframeStartTime = process.hrtime();
  const iframeCompiler = webpack(iframeConfig);
  const devMiddlewareOptions = {
    noInfo: true,
    publicPath: iframeConfig.output.publicPath,
    watchOptions: iframeConfig.watchOptions || {},
    ...iframeConfig.devServer,
  };

  const router = new Router();
  const webpackDevMiddlewareInstance = webpackDevMiddleware(iframeCompiler, devMiddlewareOptions);
  router.use(webpackDevMiddlewareInstance);
  router.use(webpackHotMiddleware(iframeCompiler));

  // custom middleware
  middlewareFn(router);

  const iframePromise = new Promise((res, rej) => {
    webpackDevMiddlewareInstance.waitUntilValid(stats => {
      const iframeTotalTime = process.hrtime(iframeStartTime);
      logger.trace({ message: 'iframe built', time: iframeTotalTime });

      if (stats.hasErrors()) {
        rej(stats);
      } else {
        res(stats);
      }
    });
  });

  Promise.all([managerPromise, iframePromise])
    .then(([, iframeStats]) => {
      router.get('/', (request, response) => {
        response.set('Content-Type', 'text/html');
        response.sendFile(path.join(`${outputDir}/index.html`));
      });
      router.get(/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript	');
        response.sendFile(path.join(`${outputDir}/${request.params[0]}`));
      });

      webpackResolve(iframeStats);
    })
    .catch(e => webpackReject(e));

  return router;
}
