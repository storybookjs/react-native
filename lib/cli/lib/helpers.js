import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import latestVersion from 'latest-version';
import { sync as spawnSync } from 'cross-spawn';
import { gt } from 'semver';

import { version, devDependencies } from '../package.json';

const logger = console;

export async function getVersion(packageName) {
  let current;
  if (packageName === '@storybook/cli') {
    current = version;
  } else if (/storybook/.test(packageName)) {
    current = devDependencies[packageName];
  }

  let latest;
  try {
    latest = await latestVersion(packageName);
  } catch (e) {
    if (current) {
      logger.warn(`\n     ${chalk.yellow(e.message)}`);
      return current;
    }

    logger.error(`\n     ${chalk.red(e.message)}`);
    process.exit(1);
  }

  return current && gt(current.replace(/^\^/, ''), latest) ? current : `^${latest}`;
}

export function getVersions(...packageNames) {
  return Promise.all(packageNames.map(getVersion));
}

export function getPackageJson() {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function writePackageJson(packageJson) {
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  const packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
}

export function commandLog(message) {
  process.stdout.write(chalk.cyan(' • ') + message);
  const done = (errorMessage, errorInfo) => {
    if (errorMessage) {
      process.stdout.write(`. ${chalk.red('✖')}\n`);
      logger.error(`\n     ${chalk.red(errorMessage)}`);

      if (!errorInfo) return;

      const newErrorInfo = errorInfo
        .split('\n')
        .map(line => `     ${chalk.dim(line)}`)
        .join('\n');
      logger.error(`${newErrorInfo}\n`);
      return;
    }

    process.stdout.write(`. ${chalk.green('✓')}\n`);
  };

  return done;
}

export function paddedLog(message) {
  const newMessage = message
    .split('\n')
    .map(line => `    ${line}`)
    .join('\n');

  logger.log(newMessage);
}

export function getChars(char, amount) {
  let line = '';
  for (let lc = 0; lc < amount; lc++) { // eslint-disable-line
    line += char;
  }

  return line;
}

export function codeLog(codeLines, leftPadAmount) {
  let maxLength = 0;
  const newLines = codeLines.map(line => {
    maxLength = line.length > maxLength ? line.length : maxLength;
    return line;
  });

  const finalResult = newLines
    .map(line => {
      const rightPadAmount = maxLength - line.length;
      let newLine = line + getChars(' ', rightPadAmount);
      newLine = getChars(' ', leftPadAmount || 2) + chalk.inverse(` ${newLine} `);
      return newLine;
    })
    .join('\n');

  logger.log(finalResult);
}

export function installDeps(options) {
  let done = commandLog('Preparing to install dependencies');
  done();
  logger.log();

  let result;
  if (options.useYarn) {
    result = spawnSync('yarn', { stdio: 'inherit' });
  } else {
    result = spawnSync('npm', ['install'], { stdio: 'inherit' });
  }

  logger.log();
  done = commandLog('Installing dependencies');
  if (result.status !== 0) {
    done('An error occurred while installing dependencies.');
    process.exit(1);
  }
  done();
}
