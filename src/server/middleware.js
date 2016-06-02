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
  const compiler = webpack(config);
  const devMiddlewareOptions = {
    noInfo: true,
    publicPath: config.output.publicPath,
  };

  const router = new Router();
  router.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  router.use(webpackHotMiddleware(compiler));

  router.get('/', function (req, res) {
    res.send(getIndexHtml(config.output.publicPath));
  });

  const headHtml = getHeadHtml(configDir);
  router.get('/iframe.html', function (req, res) {
    res.send(getIframeHtml(headHtml, config.output.publicPath));
  });

  return router;
}
