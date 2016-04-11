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

// avoid ESLint errors
const logger = console;

program
  .version(packageJson.version)
  .option('-s, --static-dir [dir-name]', 'Directory where to load static files from')
  .option('-o, --output-dir [dir-name]', 'Directory where to store built files')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .parse(process.argv);

// create output directory (and the static dir) if not exists
const outputDir = program.outputDir || './storybook-static';
shelljs.mkdir('-p', path.resolve(outputDir, 'static'));

// Write both the storybook UI and IFRAME HTML files to destination path.
fs.writeFileSync(path.resolve(outputDir, 'index.html'), getIndexHtml());
fs.writeFileSync(path.resolve(outputDir, 'iframe.html'), getIframeHtml());

// copy all static files
if (program.staticDir) {
  if (!fs.existsSync(program.staticDir)) {
    logger.error(`Error: no such directory to load static files: ${program.staticDir}`);
    process.exit(-1);
  }
  logger.log(`=> Copying static files from: ${program.staticDir}`);
  shelljs.cp('-r', `${program.staticDir}/`, outputDir);
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
const configDir = program.configDir || './.storybook';
const config = loadConfig(baseConfig, configDir);

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
      const dstPath = path.resolve(outputDir, `static/${filename}`);
      fs.writeFileSync(dstPath, source);
      continue;
    }

    const source = asset._value;
    const dstPath = path.resolve(outputDir, `static/${filename}`);
    fs.writeFileSync(dstPath, source);
  }
});
