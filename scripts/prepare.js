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

function cleanup() {
  // add .ts filtering to babel args and remove after babel - 7 is adopted
  // --copy-files option doesn't work with --ignore
  // https://github.com/babel/babel/issues/5404
  if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
    // ^(?!.*\.d\.ts$).*\.(ts|tsx)$ => Remove everything except .d.ts files https://regex101.com/r/gEBQ0U/16
    const files = shell.find('dist').filter(tsFile => tsFile.match(/^(?!.*\.d\.ts$).*\.(ts|tsx)$/));
    if (files.length) {
      shell.rm(files);
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
cleanup();

tscfy({ errorCallback: errorLogs => logError('ts', packageJson, errorLogs) });

console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`));
