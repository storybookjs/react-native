#!/usr/bin/env node

import express from 'express';
import favicon from 'serve-favicon';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import shelljs from 'shelljs';
import storybook from './middleware';
import packageJson from '../../package.json';
import { parseList, getEnvConfig } from './utils';
import { track, dontTrack } from './track_usage';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const logger = console;

program
  .version(packageJson.version)
  .option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt)
  .option('-h, --host [string]', 'Host to run Storybook')
  .option('-s, --static-dir <dir-names>', 'Directory where to load static files from')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .option('--dont-track', 'Do not send anonymous usage stats.')
  .option('-d, --db-path [db-file]', 'DEPRECATED!')
  .option('--enable-db', 'DEPRECATED!')
  .parse(process.argv);

if (program.enableDb || program.dbPath) {
  logger.error([
    'Error: the experimental local database addon is no longer bundled with',
    'react-storybook. Please remove these flags (-d,--db-path,--enable-db)',
    'from the command or npm script and try again.',
  ].join(' '));
  process.exit(1);
}

// The key is the field created in `program` variable for
// each command line argument. Value is the env variable.
getEnvConfig(program, {
  port: 'SBCONFIG_PORT',
  host: 'SBCONFIG_HOSTNAME',
  staticDir: 'SBCONFIG_STATIC_DIR',
  configDir: 'SBCONFIG_CONFIG_DIR',
  dontTrack: 'SBCONFIG_DO_NOT_TRACK',
});

if (program.dontTrack) {
  dontTrack();
}

if (!program.port) {
  logger.error('Error: port to run Storybook is required!\n');
  program.help();
  process.exit(-1);
}

// Used with `app.listen` below
const listenAddr = [program.port];

if (program.host) {
  listenAddr.push(program.host);
}

const app = express();
app.use(favicon(path.resolve(__dirname, 'public/favicon.ico')));

if (program.staticDir) {
  program.staticDir = parseList(program.staticDir);
  program.staticDir.forEach((dir) => {
    const staticPath = path.resolve(dir);
    if (!fs.existsSync(staticPath)) {
      logger.error(`Error: no such directory to load static files: ${staticPath}`);
      process.exit(-1);
    }
    logger.log(`=> Loading static files from: ${staticPath} .`);
    app.use(express.static(staticPath, { index: false }));
  });
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
const configDir = program.configDir || './.storybook';

// The repository info is sent to the storybook while running on
// development mode so it'll be easier for tools to integrate.
const exec = cmd => shelljs.exec(cmd, { silent: true }).stdout.trim();
process.env.STORYBOOK_GIT_ORIGIN = process.env.STORYBOOK_GIT_ORIGIN || exec('git remote get-url origin');
process.env.STORYBOOK_GIT_BRANCH = process.env.STORYBOOK_GIT_BRANCH || exec('git symbolic-ref HEAD --short');

// NOTE changes to env should be done before calling `getBaseConfig`
// `getBaseConfig` function which is called inside the middleware
app.use(storybook(configDir));

app.listen(...listenAddr, function (error) {
  if (error) {
    throw error;
  } else {
    const address = `http://${program.host || 'localhost'}:${program.port}/`;
    logger.info(`\nReact Storybook started on => ${chalk.cyan(address)}\n`);
    track();
  }
});
