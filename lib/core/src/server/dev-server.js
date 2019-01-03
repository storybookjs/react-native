import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { getMiddleware } from './utils/middleware';

import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

let webpackResolve = () => {};
let webpackReject = () => {};

const dllPath = path.join(__dirname, '../../dll');

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

const cache = {};

export default async function(options) {
  const configDir = path.resolve(options.configDir);
  const outputDir = path.resolve(options.outputDir || path.join(__dirname, '..', 'public'));
  const configType = 'DEVELOPMENT';

  const startTime = process.hrtime();
  let managerTotalTime;
  let previewTotalTime;

  const managerPromise = loadManagerConfig({
    configType,
    outputDir,
    configDir,
    cache,
    corePresets: [require.resolve('./manager/manager-preset.js')],
  }).then(
    config =>
      new Promise((resolve, reject) => {
        webpack(config).watch(
          {
            aggregateTimeout: 1,
            ignored: /node_modules/,
          },
          (err, stats) => {
            managerTotalTime = process.hrtime(startTime);
            if (err) {
              reject(err);
            } else if (stats.hasErrors()) {
              reject(stats);
            } else {
              resolve(stats);
            }
          }
        );
      })
  );

  const iframeConfig = await loadConfig({
    configType,
    outputDir,
    cache,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
    ...options,
  });

  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let { publicPath } = iframeConfig.output;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const iframeCompiler = webpack(iframeConfig);
  const devMiddlewareOptions = {
    publicPath: iframeConfig.output.publicPath,
    watchOptions: {
      aggregateTimeout: 1,
      ignored: /node_modules/,
      ...(iframeConfig.watchOptions || {}),
    },
    // this actually causes 0 (regular) output from wdm & webpack
    logLevel: 'warn',
    clientLogLevel: 'warning',
    noInfo: true,
    ...iframeConfig.devServer,
  };

  const router = new Router();
  const webpackDevMiddlewareInstance = webpackDevMiddleware(iframeCompiler, devMiddlewareOptions);
  router.use(webpackDevMiddlewareInstance);
  router.use(webpackHotMiddleware(iframeCompiler));

  // custom middleware
  middlewareFn(router);

  const previewPromise = new Promise((resolve, reject) => {
    webpackDevMiddlewareInstance.waitUntilValid(stats => {
      previewTotalTime = process.hrtime(startTime);

      if (!stats) {
        reject(new Error('no stats after building iframe'));
      } else if (stats.hasErrors()) {
        reject(stats);
      } else {
        resolve(stats);
      }
    });
  });

  Promise.all([managerPromise, previewPromise])
    .then(([managerStats, previewStats]) => {
      router.get('/', (request, response) => {
        response.set('Content-Type', 'text/html');
        response.sendFile(path.join(`${outputDir}/index.html`));
      });
      router.get(/\/sb_dll\/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript');
        response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
      });
      router.get(/\/sb_dll\/(.+\.LICENCE)$/, (request, response) => {
        response.set('Content-Type', 'text/html');
        response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
      });
      router.get(/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript');
        response.sendFile(path.join(`${outputDir}/${request.params[0]}`));
      });

      webpackResolve({ previewStats, managerStats, managerTotalTime, previewTotalTime });
    })
    .catch(e => webpackReject(e));

  return router;
}
