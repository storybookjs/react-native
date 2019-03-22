const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/*
 * d.ts files of angular have to be copied manually as long as angular
 * needs special treatment in our build process
 */
function copyAngularDeclarations() {
  const indexDtsPath = path.join('client', 'preview', 'index.d.ts');
  const sourcePath = path.join(process.cwd(), 'src', indexDtsPath);
  const destPath = path.join(process.cwd(), 'dist/', indexDtsPath);
  fs.copyFileSync(sourcePath, destPath);
}

function getCommand(watch) {
  const tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');

  const args = ['--outDir ./dist', '--listEmittedFiles true'];

  if (!process.cwd().includes(path.join('app', 'angular'))) {
    args.push('--emitDeclarationOnly --declaration true');
  } else {
    args.push('--emitDeclarationOnly --declaration true');
    copyAngularDeclarations();
  }

  if (watch) {
    args.push('-w');
  }
  console.log(`${tsc} ${args.join(' ')}`);
  return `${tsc} ${args.join(' ')}`;
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback();
    }

    shell.exit(code);
  }
}

function tscfy(options = {}) {
  const { watch = false, silent = false, errorCallback } = options;
  const tsConfigFile = 'tsconfig.json';

  if (!fs.existsSync(tsConfigFile)) {
    if (!silent) {
      console.log(`No ${tsConfigFile}`);
    }
    return;
  }

  const content = fs.readFileSync(tsConfigFile);
  const tsConfig = JSON.parse(content);

  if (tsConfig && tsConfig.lerna && tsConfig.lerna.disabled === true) {
    if (!silent) {
      console.log('Lerna disabled');
    }
    return;
  }

  const command = getCommand(watch);
  const { code } = shell.exec(command, { silent });

  handleExit(code, errorCallback);
}

module.exports = {
  tscfy,
};
