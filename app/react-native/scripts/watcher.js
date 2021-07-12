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

const watchPaths = [...getGlobs(), getMainPath()];
if (getPreviewExists()) {
  watchPaths.push(getPreviewPath());
}

chokidar.watch(watchPaths).on('all', (event, watchPath) => {
  log(`event ${event} for file ${path.basename(watchPath)}`);
  writeRequires();
});
