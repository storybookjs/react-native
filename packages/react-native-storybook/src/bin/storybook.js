#!/usr/bin/env node

import program from 'commander';

program
  .version(require('../../package.json').version)
  .command('start', 'starts storybook webapp', { isDefault: true })
  .command('build', 'builds storybook webapp')
  .parse(process.argv);
