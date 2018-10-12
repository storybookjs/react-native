import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { getMiddleware } from './utils';
import loadConfig from './config';

let webpackResolve = () => {};
let webpackReject = () => {};

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default function(options) {
  const { configDir } = options;

  // Build the webpack configuration using the `getBaseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const iframeConfig = loadConfig({
    configType: 'DEVELOPMENT',
    corePresets: [require.resolve('./core-preset-dev.js')],
    ...options,
  });
  const managerConfig = loadConfig({
    configType: 'DEVELOPMENT',
    corePresets: [require.resolve('./core-preset-manager.js')],
    ...options,
  });

  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let { publicPath } = iframeConfig.output;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const managerCompiler = webpack(managerConfig);
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
      if (stats.hasErrors()) {
        // console.log('\n\niframe errors\n\n');
        console.log(stats.hasErrors());
        // console.log('\n\niframe errors\n\n');
        rej(stats);
      } else {
        // console.log('\n\niframe valid\n\n');
        res(stats);
      }
    });
  });

  const managerPromise = new Promise((res, rej) => {
    managerCompiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        // console.log('\n\nmanager errors\n\n');
        console.log(err, stats.hasErrors());
        // console.log('\n\nmanager errors\n\n');
        rej(stats);
      } else {
        // console.log('\n\nmanager valid\n\n');
        res(stats);
      }
    });
  });

  Promise.all([managerPromise, iframePromise])
    .then(([managerStats, iframeStats]) => {
      // console.log('\n\nPromise all\n\n');

      // console.log({ __dirname, publicPath, iframeConfig, managerConfig });

      router.get('/', (request, response) => {
        response.set('Content-Type', 'text/html');
        response.sendFile(path.join(`${__dirname}/public/index.html`));
      });
      router.get(/(.+\.js)$/, (request, response) => {
        response.set('Content-Type', 'text/javascript	');
        response.sendFile(path.join(`${__dirname}/public/${request.params[0]}`));
      });
      // router.get('/iframe.html', (request, response) => {
      //   response.set('Content-Type', 'text/html');
      //   response.sendFile(path.join(`${__dirname}/public/iframe.html`));
      // });

      webpackResolve(iframeStats);
    })
    .catch(e => {
      console.log('catch', e);
      return webpackReject(e);
    });

  return router;
}
