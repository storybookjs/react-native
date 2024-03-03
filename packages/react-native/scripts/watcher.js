const chokidar = require('chokidar');
const path = require('path');

const { writeRequires, getMain, getFilePathExtension } = require('./loader');

const { getArguments } = require('./handle-args');

const args = getArguments();

if (!args.v6Store) {
  console.log(
    "in v7 you don't need the watcher anymore, if you are using v6 compat mode then pass the -v6 flag"
  );

  process.exit(0);
}

const log = console.log.bind(console);

const mainExt = getFilePathExtension(args, 'main');
const previewExt = getFilePathExtension(args, 'preview');

const watchPaths = [`./main.${mainExt}`];

if (previewExt) {
  watchPaths.push(`./preview.${previewExt}`);
}

console.log(watchPaths);

const updateRequires = (event, watchPath) => {
  if (typeof watchPath === 'string') {
    log(`event ${event} for file ${path.basename(watchPath)}`);
  }
  writeRequires(args);
};

const globs = getMain(args).stories;
// directory
// files
const globsStrings = globs.map((g) => {
  if (typeof g === 'string') return g;
  if (g.directory && g.files) {
    return `${g.directory}/${g.files}`;
  }
});

chokidar
  .watch(watchPaths, { cwd: args.configPath })
  .on('change', (watchPath) => updateRequires('change', watchPath));

let isReady = false;

chokidar
  .watch(globsStrings, { cwd: args.configPath })
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
