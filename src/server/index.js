#!/usr/bin/env node

process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import config from './webpack.config';
import express from 'express';

const logger = console;

const app = express();
const port = process.argv[2] ? parseInt(process.argv[2], 10) : 4000;

const compiler = webpack(config);
const devMiddlewareOptions = {
  noInfo: true,
  publicPath: config.output.publicPath,
};
app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.send(getIndexHtml());
});

app.get('/iframe', function (req, res) {
  res.send(getIframeHtml());
});

app.listen(port, function (error) {
  if (error) {
    throw error;
  } else {
    logger.info(`React Storybook started on => http://localhost:${port}/ \n`);
  }
});
