const path = require('path');
const shell = require('shelljs');

function babelify(options = {}) {
  const { watch = false, silent = true, errorCallback } = options;

  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');
  const args = [
    '--ignore __mocks__/,tests/*,__tests__/,**.test.js,stories/,**.story.js,**.stories.js,__snapshots__',
    '--plugins "transform-runtime"',
    './src --out-dir ./dist',
    '--copy-files',
  ];

  if (watch) {
    args.push('-w');
  }

  const command = `${babel} ${args.join(' ')}`;
  const { code } = shell.exec(command, { silent });

  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback();
    }

    shell.exit(code);
  }
}

module.exports = {
  babelify,
};
