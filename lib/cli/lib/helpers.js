/* eslint-disable no-param-reassign */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { sync as spawnSync } from 'cross-spawn';
import { gt, satisfies } from 'semver';
import latestVersion from './latest_version';

import { version, devDependencies } from '../package.json';

const logger = console;

export async function getVersion(npmOptions, packageName, constraint) {
  let current;
  if (packageName === '@storybook/cli') {
    current = version;
  } else if (/storybook/.test(packageName)) {
    current = devDependencies[packageName];
  }

  let latest;
  try {
    latest = await latestVersion(npmOptions, packageName, constraint);
  } catch (e) {
    if (current) {
      logger.warn(`\n     ${chalk.yellow(e.message)}`);
      return current;
    }

    logger.error(`\n     ${chalk.red(e.message)}`);
    process.exit(1);
  }

  const versionToUse =
    current && (!constraint || satisfies(current, constraint)) && gt(current, latest)
      ? current
      : latest;
  return `^${versionToUse}`;
}

export function getVersions(npmOptions, ...packageNames) {
  return Promise.all(packageNames.map(packageName => getVersion(npmOptions, packageName)));
}

export function getPackageJson() {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function getBowerJson() {
  const bowerJsonPath = path.resolve('bower.json');
  if (!fs.existsSync(bowerJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(bowerJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function getAngularJson() {
  const angularJsonPath = path.resolve('angular.json');
  if (!fs.existsSync(angularJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(angularJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function getAngularAppTsConfigPath() {
  const angularJson = getAngularJson();
  const { defaultProject } = angularJson;
  const tsConfigPath = angularJson.projects[defaultProject].architect.build.options.tsConfig;

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }
  return tsConfigPath;
}

export function getAngularAppTsConfigJson() {
  const tsConfigPath = getAngularAppTsConfigPath();

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }

  const jsonContent = fs.readFileSync(tsConfigPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function writeAngularAppTsConfig(tsConfigJson) {
  const content = `${JSON.stringify(tsConfigJson, null, 2)}\n`;
  const tsConfigPath = getAngularAppTsConfigPath();
  if (tsConfigPath) {
    fs.writeFileSync(path.resolve(tsConfigPath), content, 'utf8');
  }
}

export function writePackageJson(packageJson) {
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  const packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
}

export function writeBabelRc(babelRc) {
  const content = `${JSON.stringify(babelRc, null, 2)}\n`;
  const babelRcPath = path.resolve('.babelrc');

  fs.writeFileSync(babelRcPath, content, 'utf8');
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
  for (let lc = 0; lc < amount; lc += 1) {
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

export function installDepsFromPackageJson(options) {
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

/**
 * Add dependencies to a project using `yarn add` or `npm install`.
 *
 * @param {Object} npmOptions contains `useYarn` and `installAsDevDependencies` which we use to determine how we install packages.
 * @param {Array} dependencies contains a list of packages to add.
 * @example
 * installDependencies(npmOptions, [
 *   `@storybook/react@${storybookVersion}`,
 *   `@storybook/addon-actions@${actionsVersion}`,
 *   `@storybook/addon-links@${linksVersion}`,
 *   `@storybook/addons@${addonsVersion}`,
 * ]);
 */
export function installDependencies(npmOptions, dependencies) {
  const spawnCommand = npmOptions.useYarn ? 'yarn' : 'npm';
  const installCommand = npmOptions.useYarn ? 'add' : 'install';

  const installArgs = [installCommand, ...dependencies];

  if (npmOptions.installAsDevDependencies) {
    installArgs.push('-D');
  }

  const dependencyResult = spawnSync(spawnCommand, installArgs, {
    stdio: 'inherit',
  });

  if (dependencyResult.status !== 0) {
    logger.error('An error occurred while installing dependencies.');
    process.exit(1);
  }
}

/**
 * Detect if any babel depencies need to be added to the project
 * @param {Object} npmOptions Passed along to `latestVersion` and `getVersion`
 * @param {Object} packageJson The current package.json so we can inspect its contents
 * @returns {Array} Contains the packages and versions that need to be installed
 * @example
 * const babelDependencies = await getBabelDependencies(npmOptions, packageJson);
 * // you can then spread the result when using installDependencies
 * installDependencies(npmOptions, [
 *   `@storybook/react@${storybookVersion}`,
 *   ...babelDependencies,
 * ]);
 */
export async function getBabelDependencies(npmOptions, packageJson) {
  const dependenciesToAdd = [];
  let babelLoaderVersion = '^8.0.0-0';

  const babelCoreVersion =
    packageJson.dependencies['babel-core'] || packageJson.devDependencies['babel-core'];

  if (!babelCoreVersion) {
    if (!packageJson.dependencies['@babel/core'] && !packageJson.devDependencies['@babel/core']) {
      const babelCoreInstallVersion = await getVersion(npmOptions, '@babel/core');
      dependenciesToAdd.push(`@babel/core@${babelCoreInstallVersion}`);
    }
  } else {
    const latestCompatibleBabelVersion = await latestVersion(
      npmOptions,
      'babel-core',
      babelCoreVersion
    );
    // Babel 6
    if (satisfies(latestCompatibleBabelVersion, '^6.0.0')) {
      babelLoaderVersion = '^7.0.0';
    }
  }

  if (!packageJson.dependencies['babel-loader'] && !packageJson.devDependencies['babel-loader']) {
    const babelLoaderInstallVersion = await getVersion(
      npmOptions,
      'babel-loader',
      babelLoaderVersion
    );
    dependenciesToAdd.push(`babel-loader@${babelLoaderInstallVersion}`);
  }

  return dependenciesToAdd;
}

export function addToDevDependenciesIfNotPresent(packageJson, name, packageVersion) {
  if (!packageJson.dependencies[name] && !packageJson.devDependencies[name]) {
    packageJson.devDependencies[name] = packageVersion;
  }
}
