import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import baseConfig from './webpack.config';
import loadConfig from './config';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import { getHeadHtml } from './utils';

export default function (configDir) {
  // Build the webpack configuration using the `baseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const config = loadConfig('DEVELOPMENT', baseConfig, configDir);

  // remove the leading '/'
  let publicPath = config.output.publicPath;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const compiler = webpack(config);
  const devMiddlewareOptions = {
    noInfo: true,
    publicPath: config.output.publicPath,
  };

  const router = new Router();
  router.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  router.use(webpackHotMiddleware(compiler));

  router.get('/', function (req, res) {
    res.send(getIndexHtml(publicPath));
  });

  const headHtml = getHeadHtml(configDir);
  router.get('/iframe.html', function (req, res) {
    res.send(getIframeHtml(headHtml, publicPath));
  });

  return router;
}
