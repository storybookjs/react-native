/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
// const log = require('npmlog');

function tscfy(options = {}) {
  const { watch = false, silent = true } = options;
  const tsConfigFile = 'tsconfig.json';

  if (!fs.existsSync(tsConfigFile)) {
    if (!silent) console.log(`No ${tsConfigFile}`);
    return;
  }

  const content = fs.readFileSync(tsConfigFile);
  const tsConfig = JSON.parse(content);

  if (tsConfig && tsConfig.lerna && tsConfig.lerna.disabled === true) {
    if (!silent) console.log('Lerna disabled');
    return;
  }

  const tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');
  const args = ['--outDir dist', '-d true', '--listEmittedFiles true'];

  if (watch) {
    args.push('-w');
  }

  const command = `${tsc} ${args.join(' ')}`;
  const { code } = shell.exec(command, { silent });

  if (code !== 0) {
    // log.error(`FAILED: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`);
    console.error('Failed to compile ts');
    shell.exit(code);
  }
}

module.exports = {
  tscfy,
};
