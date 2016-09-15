import runTests from './test_runner';
import loadConfig from './config';
import { getStorybook } from '@kadira/storybook';
import path from 'path';
import program from 'commander';
import chokidar from 'chokidar';

const { jasmine } = global;

program
  .option('-c, --config-dir [dir-name]',
          'Directory where to load Storybook configurations from')
  .option('-u, --update [boolean]', 'Update saved story snapshots')
  .option('-i, --update-interactive [boolean]',
          'Update saved story snapshots interactively')
  .option('-g, --grep [string]', 'only test stories matching regexp')
  .option('-w, --watch [boolean]', 'watch file changes and rerun tests')
  .parse(process.argv);

const configDir = program.configDir || './.storybook';

const configPath = path.resolve(`${configDir}`, 'config');

const babelConfig = loadConfig(configDir);
babelConfig.babelrc = false;

require('babel-register')(babelConfig);
require('babel-polyfill');

const fileExts = ['jpg', 'png', 'gif', 'eot', 'svg', 'ttf', 'woff', 'woff2']
const moduleExts = ['css', 'scss', 'sass']

fileExts.forEach(ext => {
  require.extensions[`.${ext}`] = function () {
    return '';
  };
})

moduleExts.forEach(ext => {
  require.extensions[`.${ext}`] = function () {
    return {};
  };
})

if(program.watch) {
  var watcher = chokidar.watch('.', {
    ignored: 'node_modules', // TODO: Should node_modules also be watched?
    persistent: true
  });

  watcher.on('ready', () => {
    console.log('storybook-snapshot-test is in watch mode.');
    watcher.on('all', () => {
      // Need to remove the require cache. Because it containes modules before
      // changes were made.
      Object.keys(require.cache).forEach(key => {
        delete require.cache[key];
      })
      require(configPath);
      const changedStorybook = require('@kadira/storybook').getStorybook()
      runTests(changedStorybook, program);
    });
  })
}

require(configPath);
runTests(getStorybook(), program);
