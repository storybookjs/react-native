const chokidar = require('chokidar');
const path = require('path');

const { writeRequires, getMain, getPreviewExists } = require('./loader');

const { getArguments } = require('./handle-args');

const args = getArguments();
const log = console.log.bind(console);

const watchPaths = ['./main.js'];

if (getPreviewExists(args)) {
  watchPaths.push('./preview.js');
}

const updateRequires = (event, watchPath) => {
  if (typeof watchPath === 'string') {
    log(`event ${event} for file ${path.basename(watchPath)}`);
  }
  writeRequires(args);
};

const globs = getMain(args).stories;

chokidar
  .watch(watchPaths, { cwd: args.configPath })
  .on('change', (watchPath) => updateRequires('change', watchPath));

let isReady = false;

chokidar
  .watch(globs, { cwd: args.configPath })
  .on('ready', () => {
    log('Watcher is ready, performing initial write');
    writeRequires(args);
    log('Waiting for changes, press r to manually re-write');
    isReady = true;
  })
  .on('add', (watchPath) => {
    if (isReady) {
      updateRequires('add', watchPath);
    }
  })
  .on('unlink', (watchPath) => {
    if (isReady) {
      updateRequires('unlink', watchPath);
    }
  });

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
  if (key.name === 'r') {
    log('Detected "r" keypress, rewriting story imports...');
    writeRequires(args);
  }
});
