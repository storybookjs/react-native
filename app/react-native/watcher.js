/* eslint-disable no-console */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const log = console.log.bind(console);

const { getGlobs, writeRequires, getMainPath } = require('./loader');

chokidar.watch([...getGlobs(), getMainPath()]).on('all', (event, watchPath) => {
  log(`File ${watchPath} has been ${event}`);
  writeRequires();
});
