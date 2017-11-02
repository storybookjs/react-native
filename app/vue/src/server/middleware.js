import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getBaseConfig from './config/webpack.config';
import loadConfig from './config';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import { getPreviewHeadHtml, getManagerHeadHtml, getMiddleware } from './utils';

let webpackResolve = () => {};
let webpackReject = () => {};
export const webpackValid = new Promise((resolve, reject) => {
  webpackResolve = resolve;
  webpackReject = reject;
});

export default function(configDir) {
  // Build the webpack configuration using the `getBaseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const config = loadConfig('DEVELOPMENT', getBaseConfig(), configDir);
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
    const data = {
      publicPath: config.output.publicPath,
      assets: stats.toJson().assetsByChunkName,
    };

    router.get('/', (req, res) => {
      const headHtml = getManagerHeadHtml(configDir);
      res.send(getIndexHtml({ publicPath, headHtml }));
    });

    router.get('/iframe.html', (req, res) => {
      const headHtml = getPreviewHeadHtml(configDir);
      res.send(getIframeHtml({ ...data, headHtml, publicPath }));
    });

    if (stats.toJson().errors.length) {
      webpackReject(stats);
    } else {
      webpackResolve(stats);
    }
  });

  return router;
}
