#!/usr/bin/env node

import datastore from '@kadira/storybook-database-local/dist/server/middleware';
import express from 'express';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import storybook from './middleware';
import packageJson from '../../package.json';
import { parseList, getEnvConfig } from './utils';
import { track, dontTrack } from './track_usage';

const logger = console;

program
  .version(packageJson.version)
  .option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt)
  .option('-h, --host [string]', 'Host to run Storybook')
  .option('-s, --static-dir <dir-names>', 'Directory where to load static files from', parseList)
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .option('-d, --db-path [db-file]', 'File where to store addon database JSON file')
  .option('--enable-db', 'Enable the (experimental) addon database service on dev-server')
  .option('--dont-track', 'Do not send anonymous usage stats.')
  .parse(process.argv);

// The key is the field created in `program` variable for
// each command line argument. Value is the env variable.
getEnvConfig(program, {
  port: 'STORYBOOK_PORT',
  host: 'STORYBOOK_HOST',
  staticDir: 'STORYBOOK_STATIC_DIR',
  configDir: 'STORYBOOK_CONFIG_DIR',
  dontTrack: 'STORYBOOK_DO_NOT_TRACK',
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

if (program.staticDir) {
  program.staticDir.forEach(dir => {
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
app.use(storybook(configDir));

// The addon database service is disabled by default for now
// It should be enabled with the --enable-db for dev server
if (program.enableDb) {
  const dbPath = program.dbPath || path.resolve(configDir, 'addon-db.json');
  app.use('/db', datastore(dbPath));
}

app.listen(...listenAddr, function (error) {
  if (error) {
    throw error;
  } else {
    const address = `http://${program.host || 'localhost'}:${program.port}/`;
    logger.info(`\nReact Storybook started on => ${address}\n`);
    track();
  }
});
