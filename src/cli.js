/* eslint-disable */

import runTests from './test_runner';
import { getStorybook } from '@kadira/storybook';
import Runner from './test_runner';
import path from 'path';
import program from 'commander';
import chokidar from 'chokidar';
import EventEmitter from 'events';
import loadBabelConfig from '@kadira/storybook/dist/server/babel_config';
import { filterStorybook } from './util';
import runWithRequireContext from './require_context';
const babel = require('babel-core');

program
  .option('-c, --config-dir [dir-name]',
          'Directory where to load Storybook configurations from')
  .option('-u, --update [boolean]', 'Update saved story snapshots')
  .option('-i, --update-interactive [boolean]',
          'Update saved story snapshots interactively')
  .option('-g, --grep [string]', 'only test stories matching regexp')
  .option('-x, --exclude [string]', 'exclude stories matching regexp')
  .option('-w, --watch [boolean]', 'watch file changes and rerun tests')
  .option('--polyfills [string]', 'add global polyfills')
  .option('--loaders [string]', 'add loaders')
  .parse(process.argv);

const {
  configDir = './.storybook',
  polyfills: polyfillsPath = require.resolve('./default_config/polyfills.js'),
  loaders: loadersPath = require.resolve('./default_config/loaders.js'),
  grep,
  exclude,
} = program;

const configPath = path.resolve(configDir, 'config.js');

const babelConfig = loadBabelConfig(configDir);

// cacheDir is webpack babel loader specific. We don't run webpack.
delete babelConfig.cacheDirectory;

require('babel-register')(babelConfig);
require('babel-polyfill');

// load loaders
const loaders = require(path.resolve(loadersPath));

Object.keys(loaders).forEach(ext => {
  const loader = loaders[ext];
  require.extensions[`.${ext}`] = (m, filepath) => {
    m.exports = loader(filepath);
  };
})

// load polyfills
require(path.resolve(polyfillsPath));

// set userAgent so storybook knows we're storyshots
if(!global.navigator) {
  global.navigator = {}
};
global.navigator.userAgent = 'storyshots';

const runner = new Runner(program);

async function main() {
  try {
    const content = babel.transformFileSync(configPath, babelConfig).code;
    const contextOpts = {
      filename: configPath,
      dirname: path.resolve(configDir),
    };
    runWithRequireContext(content, contextOpts);
    const storybook = require('@kadira/storybook').getStorybook();
    const addons = require('@kadira/storybook-addons').default;

    // Channel for addons is created by storybook manager from the client side.
    // We need to polyfill it for the server side.
    const channel = new EventEmitter();
    addons.setChannel(channel);
    const result = await runner.run(filterStorybook(storybook, grep, exclude));
    const fails = result.errored + result.unmatched;
    const exitCode = fails > 0 ? 1: 0;
    if(!program.watch){
      process.exit(exitCode);
    }
  } catch (e) {
    console.log(e.stack || e);

    if(!program.watch){
      process.exit(1);
    }
  }
}

if (program.watch) {
  var watcher = chokidar.watch('.', {
    ignored: 'node_modules', // TODO: Should node_modules also be watched?
    persistent: true
  });

  watcher.on('ready', () => {
    console.log('\nStoryshots is in watch mode.\n');
    watcher.on('all', () => {
      // Need to remove the require cache. Because it containes modules before
      // changes were made.
      Object.keys(require.cache).forEach(key => {
        delete require.cache[key];
      });

      main();
    });
  });
}

main();
