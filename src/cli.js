import runTests from './test_runner';
import { getStorybook } from '@kadira/storybook';
import path from 'path';
import fs from 'fs';
import program from 'commander';
import chokidar from 'chokidar';
import EventEmitter from 'events';
import loadBabelConfig from '@kadira/storybook/dist/server/babel_config';

const { jasmine } = global;

program
  .option('-c, --config-dir [dir-name]',
          'Directory where to load Storybook configurations from')
  .option('-u, --update [boolean]', 'Update saved story snapshots')
  .option('-i, --update-interactive [boolean]',
          'Update saved story snapshots interactively')
  .option('-g, --grep [string]', 'only test stories matching regexp')
  .option('-w, --watch [boolean]', 'watch file changes and rerun tests')
  .option('--polyfills [string]', 'add global polyfills')
  .option('--loaders [string]', 'add loaders')
  .parse(process.argv);

const {
  configDir = './.storybook',
  polyfills: polyfillsPath = require.resolve('./default_config/polyfills.js'),
  loaders: loadersPath = require.resolve('./default_config/loaders.js'),
} = program

const configPath = path.resolve(`${configDir}`, 'config');

const babelConfig = loadBabelConfig(configDir);

// cacheDir is webpack babel loader specific. We don't run webpack.
delete babelConfig.cacheDirectory;

require('babel-register')(babelConfig);
require('babel-polyfill');

// load loaders
const loaders = require(path.resolve(loadersPath));
Object.keys(loaders).forEach(ext => {
  const loader = loaders[ext];
  require.extensions[`.${ext}`] = loader;
})

// load polyfills
require(path.resolve(polyfillsPath));

async function main () {
  try {
    require(configPath);
    const storybook = require('@kadira/storybook').getStorybook();
    const addons = require('@kadira/storybook-addons').default;

    // Channel for addons is created by storybook manager from the client side.
    // We need to polyfill it for the server side.
    const channel = new EventEmitter()
    addons.setChannel(channel);
    await runTests(storybook, program);
  } catch(e) {
    console.log(e.stack);
  }
}

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

      main();
    });
  })
}

main();
