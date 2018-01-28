/* eslint-disable no-console */
const path = require('path');
const shell = require('shelljs');
// const log = require('npmlog');

function babelify(options = {}) {
  const { watch = false, silent = true } = options;

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
    // log.error(`FAILED: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`);
    console.error('Failed to compile js');
    shell.exit(code);
  }
}

module.exports = {
  babelify,
};
