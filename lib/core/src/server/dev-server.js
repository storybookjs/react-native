import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { logger } from '@storybook/node-logger';
import { getMiddleware } from './utils/middleware';
import { logConfig } from './logConfig';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

const dllPath = path.join(__dirname, '../../dll');

const cache = {};

let previewProcess;
let previewReject;
let resolved = false;

const router = new Router();

export default function(options) {
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
    ...options,
  }).then(config => {
    if (options.debugWebpack) {
      logConfig('Manager webpack config', config, logger);
    }
    return new Promise((resolve, reject) => {
      webpack(config).watch(
        {
          aggregateTimeout: 1,
          ignored: /node_modules/,
        },
        (err, stats) => {
          managerTotalTime = process.hrtime(startTime);
          if (!resolved && (err || stats.hasErrors())) {
            const error = new Error('Manager build is broken');
            error.error = err;
            error.close = true;
            error.stats = stats;
            logger.line();
            logger.line();
            try {
              previewReject(error);
              previewProcess.close();
              logger.warn('force closed preview build');
            } catch (e) {
              logger.warn('Unable to close preview build!');
            }
            logger.line();
            reject(error);
          } else {
            resolve(stats);
          }
        }
      );
    });
  });

  const previewPromise = options.ignorePreview
    ? new Promise(resolve => resolve())
    : loadConfig({
        configType,
        outputDir,
        cache,
        corePresets: [require.resolve('./preview/preview-preset.js')],
        overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
        ...options,
      }).then(previewConfig => {
        if (options.debugWebpack) {
          logConfig('Preview webpack config', previewConfig, logger);
        }

        // remove the leading '/'
        let { publicPath } = previewConfig.output;
        if (publicPath[0] === '/') {
          publicPath = publicPath.slice(1);
        }

        const previewCompiler = webpack(previewConfig);

        const devMiddlewareOptions = {
          publicPath: previewConfig.output.publicPath,
          watchOptions: {
            aggregateTimeout: 1,
            ignored: /node_modules/,
            ...(previewConfig.watchOptions || {}),
          },
          // this actually causes 0 (regular) output from wdm & webpack
          logLevel: 'warn',
          clientLogLevel: 'warning',
          noInfo: true,
          ...previewConfig.devServer,
        };

        const webpackDevMiddlewareInstance = webpackDevMiddleware(
          previewCompiler,
          devMiddlewareOptions
        );

        router.use(webpackDevMiddlewareInstance);
        router.use(webpackHotMiddleware(previewCompiler));

        return new Promise((resolve, reject) => {
          previewReject = reject;
          webpackDevMiddlewareInstance.waitUntilValid(stats => {
            previewTotalTime = process.hrtime(startTime);

            if (!stats) {
              reject(new Error('no stats after building preview'));
            } else if (stats.hasErrors()) {
              reject(stats);
            } else {
              resolve(stats);
            }
          });
          previewProcess = webpackDevMiddlewareInstance;
        });
      });

  // custom middleware
  const middlewareFn = getMiddleware(configDir);
  middlewareFn(router);

  return Promise.all([managerPromise, previewPromise]).then(([managerStats, previewStats]) => {
    resolved = true;
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

    return { previewStats, managerStats, managerTotalTime, previewTotalTime, router };
  });
}
