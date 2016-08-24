#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import shelljs from 'shelljs';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .parse(process.argv);

const projectDir = path.resolve();
const configDir = path.resolve(program.configDir || './storybook');

// RN packager
shelljs.exec([
  'node node_modules/react-native/local-cli/cli.js start',
  `--projectRoots ${configDir}`,
  `--root ${projectDir}`,
].join(' '), {async: true});
