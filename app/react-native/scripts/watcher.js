const chokidar = require('chokidar');
const path = require('path');
const {
  writeRequires,
  getMainPath,
  getMain,
  getPreviewPath,
  getPreviewExists,
} = require('./loader');

const { getArguments } = require('./handle-args');

const args = getArguments();
const log = console.log.bind(console);

const watchPaths = [getMainPath(args)];
if (getPreviewExists()) {
  watchPaths.push(getPreviewPath(args));
}

const updateRequires = (event, watchPath) => {
  if (typeof watchPath === 'string') {
    log(`event ${event} for file ${path.basename(watchPath)}`);
  }
  writeRequires(args);
};

const globs = getMain(args).stories;

chokidar.watch(watchPaths).on('change', (watchPath) => updateRequires('change', watchPath));
chokidar
  .watch(globs)
  .on('add', (watchPath) => updateRequires('add', watchPath))
  .on('unlink', (watchPath) => updateRequires('unlink', watchPath));
