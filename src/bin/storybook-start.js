#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import shelljs from 'shelljs';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .parse(process.argv);

// RN packager
shelljs.exec([
  'node node_modules/react-native/local-cli/cli.js start',
  `--projectRoots ${path.resolve('storybook')}`,
  `--root ${path.resolve()}`,
].join(' '), {async: true, silent: false});
