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

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default async function(options) {
  const configDir = path.resolve(options.configDir);
  const outputDir = path.resolve(options.outputDir || path.join(__dirname, '..', 'public'));
  const configType = 'DEVELOPMENT';

  const managerStartTime = process.hrtime();
  let managerTotalTime;

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
    webpack(managerConfig).watch(
      {
        aggregateTimeout: 1,
        ignored: /node_modules/,
      },
      (err, stats) => {
        managerTotalTime = process.hrtime(managerStartTime);

        if (err || stats.hasErrors()) {
          rej(stats);
        } else {
          res(stats);
        }
      }
    );
  });

  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let { publicPath } = iframeConfig.output;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const iframeStartTime = process.hrtime();
  let iframeTotalTime;
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

  const iframePromise = new Promise((res, rej) => {
    webpackDevMiddlewareInstance.waitUntilValid(stats => {
      iframeTotalTime = process.hrtime(iframeStartTime);

      if (stats.hasErrors()) {
        rej(stats);
      } else {
        res(stats);
      }
    });
  });

  Promise.all([managerPromise, iframePromise])
    .then(([managerStats, iframeStats]) => {
      router.get('/', (request, response) => {
        response.set('Content-Type', 'text/html');
        response.sendFile(path.join(`${outputDir}/index.html`));
      });
      router.get(/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript	');
        response.sendFile(path.join(`${outputDir}/${request.params[0]}`));
      });

      webpackResolve({ iframeStats, managerStats, managerTotalTime, iframeTotalTime });
    })
    .catch(e => webpackReject(e));

  return router;
}
