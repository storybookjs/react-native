const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const log = require('npmlog');

const modulePath = path.resolve('./');
// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.join(modulePath, 'package.json'));

function removeDist() {
  shell.rm('-rf', 'dist');
}

function babelify() {
  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');
  const args = [
    '--ignore __mocks__/,tests/*,__tests__/,**.test.js,stories/,**.story.js,**.stories.js,__snapshots__',
    '--plugins "transform-runtime"',
    './src --out-dir ./dist',
    '--copy-files',
  ].join(' ');

  const command = `${babel} ${args}`;
  const { code } = shell.exec(command, { silent: true });

  if (code !== 0) {
    log.error(`FAILED: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`);
    shell.exit(code);
  }
}

function tscify() {
  if (!fs.existsSync('tsconfig.json')) {
    return;
  }

  const tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');
  const args = ['--outDir dist', '-d true'].join(' ');

  const command = `${tsc} ${args}`;
  const { code } = shell.exec(command, { silent: true });

  if (code !== 0) {
    log.error(`FAILED: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`);
    shell.exit(code);
  }
}

function copyLicence() {
  const licence = path.join(__dirname, '..', 'LICENSE');
  shell.cp(licence, './');
}

removeDist();
babelify();
tscify();
copyLicence();

// eslint-disable-next-line no-console
console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`));
