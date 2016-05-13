#!/usr/bin/env node

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import express from 'express';
import program from 'commander';
import packageJson from '../../package.json';
import baseConfig from './webpack.config';
import loadConfig from './config';
import path from 'path';
import fs from 'fs';
import { getHeadHtml } from './utils';

const logger = console;

program
  .version(packageJson.version)
  .option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt)
  .option('-h, --host [string]', 'Host to run Storybook')
  .option('-s, --static-dir [dir-name]', 'Directory where to load static files from')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .parse(process.argv);

if (!program.port) {
  logger.error('Error: port to run Storybook is required!\n');
  program.help();
  process.exit(-1);
}

if (!program.host) {
  program.host = 'localhost';
}

const app = express();

if (program.staticDir) {
  const staticPath = path.resolve(program.staticDir);
  if (fs.existsSync(staticPath)) {
    logger.log(`=> Loading static files from: ${staticPath} .`);
    app.use(express.static(staticPath, { index: false }));
  } else {
    logger.error(`Error: no such directory to load static files: ${staticPath}`);
    process.exit(-1);
  }
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
const configDir = program.configDir || './.storybook';
const config = loadConfig('DEVELOPMENT', baseConfig, configDir);

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

const headHtml = getHeadHtml(configDir);
app.get('/iframe.html', function (req, res) {
  res.send(getIframeHtml(headHtml));
});

app.listen(program.port, program.host, function (error) {
  if (error) {
    throw error;
  } else {
    logger.info(`\nReact Storybook started on => http://${program.host}:${program.port}/ \n`);
  }
});
