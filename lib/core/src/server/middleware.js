import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { getMiddleware } from './utils';

let webpackResolve = () => {};
let webpackReject = () => {};

export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default function(configDir, loadConfig, getBaseConfig, quiet) {
  // Build the webpack configuration using the `getBaseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const config = loadConfig('DEVELOPMENT', getBaseConfig(configDir, quiet), configDir);
  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let { publicPath } = config.output;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const compiler = webpack(config);
  const devMiddlewareOptions = {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: config.watchOptions || {},
    ...config.devServer,
  };

  const router = new Router();
  const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, devMiddlewareOptions);
  router.use(webpackDevMiddlewareInstance);
  router.use(webpackHotMiddleware(compiler));

  // custom middleware
  middlewareFn(router);

  webpackDevMiddlewareInstance.waitUntilValid(stats => {
    router.get('/', (req, res) => {
      res.set('Content-Type', 'text/html');
      res.sendFile(path.join(`${__dirname}/public/index.html`));
    });

    router.get('/iframe.html', (req, res) => {
      res.set('Content-Type', 'text/html');
      res.sendFile(path.join(`${__dirname}/public/iframe.html`));
    });

    if (stats.toJson().errors.length) {
      webpackReject(stats);
    } else {
      webpackResolve(stats);
    }
  });

  return router;
}
