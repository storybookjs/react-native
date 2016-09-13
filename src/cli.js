import runTests from './test_runner';
import { getStorybook } from '@kadira/storybook';
import path from 'path';
import program from 'commander';

const { jasmine } = global;

program
  .option('-c, --config-dir [dir-name]',
          'Directory where to load Storybook configurations from')
  .option('-u, --update [boolean]', 'Update saved story snapshots')
  .option('-i, --update-interactive [boolean]',
          'Update saved story snapshots interactively')
  .parse(process.argv);

const configDir = program.configDir || './.storybook';

const configPath = path.resolve(`${configDir}`, 'config');
require(configPath);

const storybook = getStorybook();

const { update, updateInteractive:updateI } = program;

runTests(storybook, {configDir, update, updateI});
