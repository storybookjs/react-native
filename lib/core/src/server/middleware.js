import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';
import childProcess from 'child-process-promise';
import { logger } from '@storybook/node-logger';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { getMiddleware } from './utils';
import loadConfig from './config';

import { loadEnv } from './config/utils';

let webpackResolve = () => {};
let webpackReject = () => {};

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default async function(options) {
  const environment = loadEnv();
  const { configDir, outputDir } = options;
  const configType = 'DEVELOPMENT';

  const managerStartTime = process.hrtime();
  const managerPromise = childProcess
    .exec(
      `node ${path.join(__dirname, 'manager/webpack.js')} dir=${configDir} out=${path.resolve(
        outputDir || path.join(__dirname, '..', 'public')
      )}`,
      {
        env: {
          NODE_ENV: 'production',
          ...environment,
        },
      }
    )
    .then(a => {
      const managerTotalTime = process.hrtime(managerStartTime);
      logger.trace({ message: 'manager built', time: managerTotalTime });

      return a;
    });

  const iframeConfig = await loadConfig({
    configType,
    outputDir,
    corePresets: [require.resolve('./core-preset-dev.js')],
    overridePresets: [require.resolve('./core-preset-webpack-custom.js')],
    ...options,
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
        response.sendFile(path.join(`${__dirname}/public/index.html`));
      });
      router.get(/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript	');
        response.sendFile(path.join(`${__dirname}/public/${request.params[0]}`));
      });

      webpackResolve(iframeStats);
    })
    .catch(e => webpackReject(e));

  return router;
}
