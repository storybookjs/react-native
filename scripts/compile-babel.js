const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch) {
  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');

  const args = [
    './src',
    '--out-dir ./dist',
    `--config-file ${path.resolve(__dirname, '../.babelrc.js')}`,
    '--copy-files',
  ];

  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    args.push('--extensions ".js"');
  } else {
    args.push('--extensions ".js,.jsx,.ts,.tsx"');
  }

  if (watch) {
    args.push('-w');
  }

  return `${babel} ${args.join(' ')}`;
}

function handleExit(code, stderr, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback(stderr);
    }

    shell.exit(code);
  }
}

function babelify(options = {}) {
  const { watch = false, silent = true, errorCallback } = options;

  if (!fs.existsSync('src')) {
    if (!silent) {
      console.log('No src dir');
    }
    return;
  }

  const command = getCommand(watch);
  if (command !== '') {
    const { code, stderr } = shell.exec(command, { silent });
    handleExit(code, stderr, errorCallback);
  }
}

module.exports = {
  babelify,
};
