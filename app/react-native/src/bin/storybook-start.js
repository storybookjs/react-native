#!/usr/bin/env node
/* eslint-disable no-console */
import path from 'path';
import program from 'commander';
import Server from '../server';

program
  .allowUnknownOption()
  .option('-h, --host <host>', 'host to listen on', 'localhost')
  .option('-p, --port <port>', 'port to listen on', 7007)
  .option('-s, --secured', 'whether server is running on https')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .option('-e, --environment [environment]', 'DEVELOPMENT/PRODUCTION environment for webpack')
  .option('-i, --manual-id', 'allow multiple users to work with same storybook')
  .option('--smoke-test', 'Exit after successful start')
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
  const address = `http://${program.host}:${program.port}/`;
  console.info(`\nReact Native Storybook started on => ${address}\n`);
  if (program.smokeTest) {
    process.exit(0);
  }
});
