import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import baseConfig from './config/webpack.config';
import loadConfig from './config';
import getIndexHtml from './index.html';

function getMiddleware(configDir) {
  const middlewarePath = path.resolve(configDir, 'middleware.js');
  if (fs.existsSync(middlewarePath)) {
    let middlewareModule = require(middlewarePath);
    if (middlewareModule.__esModule) {
      middlewareModule = middlewareModule.default;
    }
    return middlewareModule;
  }
  return function () {};
}

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
    watchOptions: config.watchOptions || {},
  };

  const router = new Router();
  const middlewareFn = getMiddleware(configDir);
  middlewareFn(router);

  router.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  router.use(webpackHotMiddleware(compiler));

  router.get('/', function (req, res) {
    res.send(getIndexHtml(publicPath));
  });

  return router;
}
