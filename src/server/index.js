#!/usr/bin/env node

process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import express from 'express';
import program from 'commander';
import packageJson from '../../package.json';
import config from './webpack.config';
import path from 'path';
import fs from 'fs';

const logger = console;

program
  .version(packageJson.version)
  .option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt)
  .option('-s, --static-dir [dir-name]', 'Directory where to load static files from')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .parse(process.argv);

if (!program.port) {
  logger.error('Error: port to run Storybook is required!\n');
  program.help();
  process.exit(-1);
}

const app = express();

if (program.staticDir) {
  const staticPath = path.resolve(program.staticDir);
  if (fs.existsSync(staticPath)) {
    logger.log(`=> Loading static files from: ${staticPath} .`);
    app.use(express.static(staticPath));
  } else {
    logger.error(`Error: no such directory to load static files: ${staticPath}`);
    process.exit(-1);
  }
}

// add config path to the entry
const configDir = program.configDir || './.storybook';
const configDirPath = path.resolve(configDir);

// load babelrc file.
const babelrcPath = path.resolve('./.babelrc');
if (fs.existsSync(babelrcPath)) {
  logger.info('=> Using custom .babelrc configurations.');
  const babelrcContent = fs.readFileSync(babelrcPath);
  try {
    const babelrc = JSON.parse(babelrcContent);
    config.module.loaders[0].query = babelrc;
  } catch (ex) {
    logger.error(`=> Error parsing .babelrc file: ${ex.message}`);
    throw ex;
  }
}

const storybookConfigPath = path.resolve(configDirPath, 'config.js');
if (!fs.existsSync(storybookConfigPath)) {
  logger.error(`=> Create a storybook config file in "${configDir}/config.js".\n`);
  process.exit(0);
}
config.entry.preview.push(storybookConfigPath);

// load custom webpack configurations
const customConfigPath = path.resolve(configDirPath, 'webpack.config.js');
let finalConfig = config;
if (fs.existsSync(customConfigPath)) {
  const customConfig = require(customConfigPath);
  logger.info('=> Loading custom webpack config.');
  finalConfig = {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // We need to use our and custom plugins.
    plugins: [
      ...config.plugins,
      ...customConfig.plugins || [],
    ],
    module: {
      ...config.module,
      // We need to use our and custom loaders.
      loaders: [
        ...config.module.loaders,
        ...customConfig.module.loaders || [],
      ],
    },
  };
}

const headHtmlPath = path.resolve(configDirPath, 'head.html');
let headHtml = '';
if (fs.existsSync(headHtmlPath)) {
  headHtml = fs.readFileSync(headHtmlPath);
}

const compiler = webpack(finalConfig);
const devMiddlewareOptions = {
  noInfo: true,
  publicPath: finalConfig.output.publicPath,
};
app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.send(getIndexHtml());
});

app.get('/iframe', function (req, res) {
  res.send(getIframeHtml(headHtml));
});

app.listen(program.port, function (error) {
  if (error) {
    throw error;
  } else {
    logger.info(`\nReact Storybook started on => http://localhost:${program.port}/ \n`);
  }
});
