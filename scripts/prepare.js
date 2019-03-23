/* eslint-disable no-console */
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

function logError(type, packageJson) {
  log.error(
    `FAILED to compile ${type}: ${chalk.boldco(`${packageJson.name}@${packageJson.version}`)}`
  );
}

const packageJson = getPackageJson();

removeDist();
babelify({ errorCallback: () => logError('js', packageJson) });
cleanup();
tscfy({ errorCallback: () => logError('ts', packageJson) });

console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`));
