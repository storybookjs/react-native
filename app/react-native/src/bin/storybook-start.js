#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import shelljs from 'shelljs';
import Server from '../server';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .option('--haul <configFile>', 'use haul with config file')
  .option('-s, --secured', 'whether server is running on https')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .option('-e, --environment [environment]', 'DEVELOPMENT/PRODUCTION environment for webpack')
  .option('-r, --reset-cache', 'reset react native packager')
  .option('--skip-packager', 'run only storybook server')
  .option('-i, --manual-id', 'allow multiple users to work with same storybook')
  .option('--smoke-test', 'Exit after successful start')
  .option('--packager-port <packagerPort>', 'Custom packager port')
  .option('--root [root]', 'Add additional root(s) to be used by the packager in this project')
  .option('--projectRoots [projectRoots]', 'Override the root(s) to be used by the packager')
  .parse(process.argv);

const projectDir = path.resolve();
const configDir = path.resolve(program.configDir || './storybook');
const listenAddr = [program.port];
if (program.host) {
  listenAddr.push(program.host);
}

const server = new Server({
  projectDir,
  configDir,
  environment: program.environment,
  manualId: program.manualId,
  secured: program.secured,
});

server.listen(...listenAddr, err => {
  if (err) {
    throw err;
  }
  const address = `http://${program.host || 'localhost'}:${program.port}/`;
  console.info(`\nReact Native Storybook started on => ${address}\n`); // eslint-disable-line no-console
  if (program.smokeTest) {
    process.exit(0);
  }
});

if (!program.skipPackager) {
  let symlinks = [];

  let roots = [projectDir];

  if (program.root) {
    roots = roots.concat(program.root.split(',').map(root => path.resolve(root)));
  }

  try {
    const findSymlinksPaths = require('react-native/local-cli/util/findSymlinksPaths'); // eslint-disable-line global-require
    symlinks = findSymlinksPaths(path.join(projectDir, 'node_modules'), [projectDir]);
  } catch (e) {
    console.warn(`Unable to load findSymlinksPaths: ${e.message}`);
  }

  let projectRoots = (configDir === projectDir ? [configDir] : [configDir, projectDir]).concat(
    symlinks
  );

  if (program.projectRoots) {
    projectRoots = projectRoots.concat(
      program.projectRoots.split(',').map(root => path.resolve(root))
    );
  }

  let cliCommand = 'node node_modules/react-native/local-cli/cli.js start';
  if (program.haul) {
    cliCommand = `node node_modules/.bin/haul start --config ${program.haul} --platform all`;
  }
  // RN packager
  shelljs.exec(
    [
      cliCommand,
      `--projectRoots ${projectRoots.join(',')}`,
      `--root ${roots.join(',')}`,
      program.resetCache && '--reset-cache',
      program.packagerPort && `--port=${program.packagerPort}`,
    ]
      .filter(x => x)
      .join(' '),
    { async: true }
  );
}
