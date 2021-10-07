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

chokidar
  .watch(globs, { cwd: args.configPath })
  .on('add', (watchPath) => updateRequires('add', watchPath))
  .on('unlink', (watchPath) => updateRequires('unlink', watchPath));
