/* eslint-disable no-console */
const chokidar = require('chokidar');

const { getGlobs, writeRequires, getMainPath } = require('./loader');

const log = console.log.bind(console);

chokidar.watch([...getGlobs(), getMainPath()]).on('all', (event, watchPath) => {
  log(`File ${watchPath} has been ${event}`);
  writeRequires();
});
