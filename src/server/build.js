#!/usr/bin/env node

process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import shelljs from 'shelljs';
import packageJson from '../../package.json';
import baseConfig from './webpack.config.prod';
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

// create output directory (and the static dir) if not exists
const outputDir = program.outputDir || './storybook-static';
shelljs.mkdir('-p', path.resolve(outputDir, publicPath));

// Write both the storybook UI and IFRAME HTML files to destination path.
const headHtml = getHeadHtml(configDir);
fs.writeFileSync(path.resolve(outputDir, 'index.html'), getIndexHtml(publicPath));
fs.writeFileSync(path.resolve(outputDir, 'iframe.html'), getIframeHtml(headHtml, publicPath));

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

// compile all resources with webpack and write them to the disk.
logger.log('Building storybook ...');
webpack(config).compile(function (err, stats) {
  for (const filename in stats.assets) {
    if (!stats.assets.hasOwnProperty(filename)) {
      continue;
    }

    const asset = stats.assets[filename];
    if (asset.children && asset.children.length) {
      const source = asset.children[0]._value;
      const dstPath = path.resolve(outputDir, publicPath, filename);
      fs.writeFileSync(dstPath, source);
      continue;
    }

    const source = asset._value;
    const dstPath = path.resolve(outputDir, publicPath, filename);

    // Ensure the asset directory exists
    shelljs.mkdir('-p', path.parse(dstPath).dir);
    fs.writeFileSync(dstPath, source);
  }

  // We need to copy the manager bundle distributed via the React Storybook
  // directly into the production build overring webpack.
  shelljs.cp(
    path.resolve(__dirname, '../manager.js'),
    path.resolve(outputDir, publicPath, 'manager.bundle.js')
  );
});
