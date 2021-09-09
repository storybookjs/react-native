const chokidar = require('chokidar');
const path = require('path');
const {
  getGlobs,
  writeRequires,
  getMainPath,
  getPreviewPath,
  getPreviewExists,
} = require('./loader');

const log = console.log.bind(console);

const watchPaths = [getMainPath()];
if (getPreviewExists()) {
  watchPaths.push(getPreviewPath());
}

const updateRequires = (event, watchPath) => {
  if (typeof watchPath === 'string') {
    log(`event ${event} for file ${path.basename(watchPath)}`);
  }
  writeRequires();
};

chokidar.watch(watchPaths).on('change', (watchPath) => updateRequires('change', watchPath));
chokidar
  .watch(getGlobs())
  .on('add', (watchPath) => updateRequires('add', watchPath))
  .on('unlink', (watchPath) => updateRequires('unlink', watchPath));
