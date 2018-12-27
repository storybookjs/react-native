/* eslint-disable no-console */
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const log = require('npmlog');
const { babelify } = require('./compile-js');
const { tscfy } = require('./compile-ts');

function getPackageJson() {
  const modulePath = path.resolve('./');

  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(path.join(modulePath, 'package.json'));
}

function removeDist() {
  shell.rm('-rf', 'dist');
}

function removeTsFromDist() {
  // add .ts filtering to babel args and remove after babel - 7 is adopted
  // --copy-files option doesn't work with --ignore
  // https://github.com/babel/babel/issues/5404

  const tsFiles = shell.find('dist').filter(tsFile => tsFile.match(/\.ts$/));

  if (tsFiles.length) {
    shell.rm(tsFiles);
  }
}

function logError(type, packageJson) {
  log.error(
    `FAILED to compile ${type}: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`
  );
}

const packageJson = getPackageJson();

removeDist();
if (packageJson && packageJson.types && packageJson.types.indexOf('d.ts') !== -1) {
  tscfy({ errorCallback: () => logError('ts', packageJson) });
} else {
  babelify({ errorCallback: () => logError('js', packageJson) });
  removeTsFromDist();
  tscfy({ errorCallback: () => logError('ts', packageJson) });
}

console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`));
