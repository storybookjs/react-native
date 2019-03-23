/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch) {
  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');

  const ignore = [
    '**/__mocks__/',
    '**/tests/',
    '**/__tests__/',
    '**/*.test.*',
    '**/stories/',
    '**/*.story.*',
    '**/*.stories.*',
    '**/__snapshots__',
    '**/*.d.ts',
  ];

  let args = [
    './src',
    '--out-dir ./dist',
    `--config-file ${path.resolve(__dirname, '../.babelrc.js')}`,
    `--extensions ".js,.jsx,.ts,.tsx"`,
    `--copy-files`,
    `--ignore "${ignore.join('","')}"`,
  ];

  /*
   * angular needs to be compiled with tsc; a compilation with babel is possible but throws
   * runtime errors because of the the babel decorators plugin
   * Copy everything, the cleanup job will remove all ts files afterwards
   */
  if (process.cwd().includes(path.join('app', 'angular'))) {
    args = ['./src', '--out-dir ./dist', '--copy-files'];
  }

  if (watch) {
    args.push('-w');
  }

  return `${babel} ${args.join(' ')}`;
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback();
    }

    shell.exit(code);
  }
}

function babelify(options = {}) {
  const { watch = false, silent = false, errorCallback } = options;

  if (!fs.existsSync('src')) {
    if (!silent) {
      console.log('No src dir');
    }
    return;
  }

  const command = getCommand(watch);
  const { code } = shell.exec(command, { silent });

  handleExit(code, errorCallback);
}

module.exports = {
  babelify,
};
