/* eslint-disable no-console */
/* tslint:disable:no-console */
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const log = require('npmlog');
const { babelify } = require('./compile-babel');
const { tscfy } = require('./compile-tsc');

function getPackageJson() {
  const modulePath = path.resolve('./');

  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(path.join(modulePath, 'package.json'));
}

function removeDist() {
  shell.rm('-rf', 'dist');
}

const ignore = ['__mocks__', '__snapshots__', '__tests__', '/tests/', /.+\.test\..+/];

function cleanup() {
  // remove files after babel --copy-files output
  // --copy-files option doesn't work with --ignore
  // https://github.com/babel/babel/issues/6226
  if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
    const files = shell.find('dist').filter(filePath => {
      if (fs.lstatSync(filePath).isDirectory()) {
        return false;
      }
      return ignore.reduce((acc, pattern) => {
        return acc || !!filePath.match(pattern);
      }, false);
    });
    if (files.length) {
      shell.rm('-f', ...files);
    }
  }
}

function logError(type, packageJson, errorLogs) {
  log.error(`FAILED (${type}) : ${errorLogs}`);
  log.error(
    `FAILED to compile ${type}: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`
  );
}

const packageJson = getPackageJson();

removeDist();

babelify({ errorCallback: errorLogs => logError('js', packageJson, errorLogs) });
tscfy({ errorCallback: errorLogs => logError('ts', packageJson, errorLogs) });

cleanup();

console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`));
