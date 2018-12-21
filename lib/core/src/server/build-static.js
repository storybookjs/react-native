import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import shelljs from 'shelljs';

import { logger } from '@storybook/node-logger';

import { getProdCli } from './cli';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

async function compileManager(managerConfig, managerStartTime) {
  logger.info('=> Compiling manager..');

  return new Promise((resolve, reject) => {
    webpack(managerConfig).run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the manager');

        if (error) {
          logger.error(error.message);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson();

          errors.forEach(e => logger.error(e));
          warnings.forEach(e => logger.error(e));
        }

        process.exitCode = 1;
        reject(error || stats);
        return;
      }

      logger.trace({ message: '=> manager built', time: process.hrtime(managerStartTime) });
      stats.toJson().warnings.forEach(e => logger.warn(e));

      resolve(stats);
    });
  });
}

async function watchPreview(previewConfig) {
  logger.info('=> Compiling preview in watch mode..');

  return new Promise(() => {
    webpack(previewConfig).watch(
      {
        aggregateTimeout: 1,
      },
      (error, stats) => {
        if (!error) {
          // eslint-disable-next-line no-console
          console.log(stats.toString({ colors: true }));
        } else {
          logger.error(error.message);
        }
      }
    );
  });
}

async function compilePreview(previewConfig, previewStartTime) {
  logger.info('=> Compiling preview..');

  return new Promise((resolve, reject) => {
    webpack(previewConfig).run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the preview');
        process.exitCode = 1;

        if (error) {
          logger.error(error.message);
          return reject(error);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson();

          errors.forEach(e => logger.error(e));
          warnings.forEach(e => logger.error(e));
          return reject(stats);
        }
      }

      logger.trace({ message: '=> Preview built', time: process.hrtime(previewStartTime) });
      stats.toJson().warnings.forEach(e => logger.warn(e));

      return resolve(stats);
    });
  });
}

async function copyAllStaticFiles(staticDir, outputDir) {
  if (staticDir && staticDir.length) {
    await Promise.all(
      staticDir.map(async dir => {
        const staticPath = path.resolve(dir);

        if (await !fs.exists(staticPath)) {
          logger.error(`Error: no such directory to load static files: ${staticPath}`);
          process.exit(-1);
        }
        shelljs.cp('-r', `${dir}/!(index.html)`, outputDir);
      })
    );
    logger.info(`=> Copying static files from: ${staticDir.join(', ')}`);
  }
}

async function buildManager(configType, outputDir, configDir) {
  logger.info('=> Building manager..');
  const managerStartTime = process.hrtime();

  logger.info('=> Loading manager config..');
  const managerConfig = await loadManagerConfig({
    configType,
    outputDir,
    configDir,
    corePresets: [require.resolve('./manager/manager-preset.js')],
  });

  return compileManager(managerConfig, managerStartTime);
}

async function buildPreview(configType, outputDir, packageJson, options) {
  const { watch } = options;

  logger.info('=> Building preview..');
  const previewStartTime = process.hrtime();

  logger.info('=> Loading preview config..');
  const previewConfig = await loadConfig({
    configType,
    outputDir,
    packageJson,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
    ...options,
  });

  if (watch) {
    return watchPreview(previewConfig);
  }

  return compilePreview(previewConfig, previewStartTime);
}

function prepareFilesStructure(outputDir, defaultFavIcon) {
  // create output directory if not exists
  shelljs.mkdir('-p', outputDir);
  shelljs.mkdir('-p', path.join(outputDir, 'sb_dll'));

  // clear the static dir
  shelljs.rm('-rf', path.join(outputDir, 'static'));
  shelljs.cp(defaultFavIcon, outputDir);

  logger.info('clean outputDir..');
  shelljs.rm('-rf', path.join(outputDir, 'static'));

  shelljs.cp(defaultFavIcon, outputDir);
}

export async function buildStaticStandalone(options) {
  const { staticDir, configDir, packageJson } = options;

  const configType = 'PRODUCTION';
  const outputDir = path.join(process.cwd(), options.outputDir);
  const dllPath = path.join(__dirname, '../../dll/*');
  const defaultFavIcon = require.resolve('./public/favicon.ico');

  prepareFilesStructure(outputDir, defaultFavIcon);

  await copyAllStaticFiles(staticDir, outputDir);

  logger.info(`=> Copying prebuild dll's..`);
  shelljs.cp('-r', dllPath, path.join(outputDir, 'sb_dll'));

  await buildManager(configType, outputDir, configDir);
  await buildPreview(configType, outputDir, packageJson, options);

  logger.info(`=> Output directory: ${outputDir}`);
}

export function buildStatic({ packageJson, ...loadOptions }) {
  const cliOptions = getProdCli(packageJson);

  return buildStaticStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: cliOptions.configDir || './.storybook',
    outputDir: cliOptions.outputDir || './storybook-static',
  });
}
