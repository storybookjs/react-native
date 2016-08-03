#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import webpack from 'webpack';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import shelljs from 'shelljs';
import packageJson from '../../package.json';
import baseConfig from './config/webpack.config.prod';
import loadConfig from './config';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import { getHeadHtml, parseList } from './utils';

// avoid ESLint errors
const logger = console;

program
  .version(packageJson.version)
  .option('-s, --static-dir <dir-names>', 'Directory where to load static files from', parseList)
  .option('-o, --output-dir [dir-name]', 'Directory where to store built files')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .parse(process.argv);

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
const configDir = program.configDir || './.storybook';
const config = loadConfig('PRODUCTION', baseConfig, configDir);

// remove the leading '/'
let publicPath = config.output.publicPath;
if (publicPath[0] === '/') {
  publicPath = publicPath.slice(1);
}

const outputDir = program.outputDir || './storybook-static';
config.output.path = outputDir;

// create output directory (and the static dir) if not exists
shelljs.rm('-rf', outputDir);
shelljs.mkdir('-p', path.resolve(outputDir, publicPath));

// copy all static files
if (program.staticDir) {
  program.staticDir.forEach(dir => {
    if (!fs.existsSync(dir)) {
      logger.error(`Error: no such directory to load static files: ${dir}`);
      process.exit(-1);
    }
    logger.log(`=> Copying static files from: ${dir}`);
    shelljs.cp('-r', `${dir}/`, outputDir);
  });
}

// Write both the storybook UI and IFRAME HTML files to destination path.
const headHtml = getHeadHtml(configDir);
fs.writeFileSync(path.resolve(outputDir, 'index.html'), getIndexHtml(publicPath));
fs.writeFileSync(path.resolve(outputDir, 'iframe.html'), getIframeHtml(headHtml, publicPath));

// compile all resources with webpack and write them to the disk.
logger.log('Building storybook ...');
webpack(config).run(function (err) {
  if (err) {
    logger.error('Failed to build the storybook');
    logger.error(err.message);
    process.exit(1);
  }
});
