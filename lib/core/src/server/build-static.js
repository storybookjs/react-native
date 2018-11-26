import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import shelljs from 'shelljs';

import { logger } from '@storybook/node-logger';

import { getProdCli } from './cli';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

const defaultFavIcon = require.resolve('./public/favicon.ico');

export function buildStaticStandalone(options) {
  const { staticDir, configDir, packageJson } = options;

  const configType = 'PRODUCTION';
  const outputDir = path.join(process.cwd(), options.outputDir);

  const dllPath = require
    .resolve('@storybook/ui/package.json')
    .replace('/package.json', '/dll/storybook_ui_dll.js');

  // create output directory if not exists
  shelljs.mkdir('-p', outputDir);
  shelljs.mkdir('-p', path.join(outputDir, 'sb_dll'));

  logger.info('clean outputDir..');
  shelljs.rm('-rf', path.join(outputDir, 'static'));

  shelljs.cp(defaultFavIcon, outputDir);

  // copy all static files
  if (staticDir) {
    staticDir.forEach(dir => {
      if (!fs.existsSync(dir)) {
        logger.error(`Error: no such directory to load static files: ${dir}`);
        process.exit(-1);
      }
      logger.info(`=> Copying static files from: ${dir}`);
      shelljs.cp('-r', `${dir}/*`, outputDir);
    });
  }

  logger.info('copy dll..');
  shelljs.cp(dllPath, path.join(outputDir, 'sb_dll'));

  let startTime;

  return new Promise(res => {
    logger.info('building manager..');
    startTime = process.hrtime();

    res();
  })
    .then(() =>
      loadManagerConfig({
        configType,
        outputDir,
        configDir,
        corePresets: [require.resolve('./manager/manager-preset.js')],
      })
    )
    .then(
      managerConfig =>
        new Promise((resolve, reject) => {
          webpack(managerConfig).run((err, stats) => {
            if (err || !stats || stats.hasErrors()) {
              logger.error('Failed to build the manager');
              // eslint-disable-next-line no-unused-expressions
              err && logger.error(err.message);
              // eslint-disable-next-line no-unused-expressions
              stats && stats.hasErrors() && stats.toJson().errors.forEach(e => logger.error(e));
              process.exitCode = 1;

              reject(stats);
            }

            resolve(stats);
          });
        })
    )
    .then(stats => {
      logger.trace({ message: 'manager built', time: process.hrtime(startTime) });
      logger.info(stats.hash);
      stats.toJson().warnings.forEach(e => logger.warn(e));
    })
    .then(() => {
      startTime = process.hrtime();
      logger.info('building preview..');
    })
    .then(() =>
      loadConfig({
        configType,
        outputDir,
        packageJson,
        corePresets: [require.resolve('./preview/preview-preset.js')],
        overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
        ...options,
      })
    )
    .then(
      config =>
        new Promise((resolve, reject) => {
          webpack(config).run((err, stats) => {
            if (err || !stats || stats.hasErrors()) {
              logger.error('Failed to build the preview');
              // eslint-disable-next-line no-unused-expressions
              err && logger.error(err.message);
              // eslint-disable-next-line no-unused-expressions
              stats && stats.hasErrors() && stats.toJson().errors.forEach(e => logger.error(e));
              process.exitCode = 1;
              reject(err);
            }

            resolve(stats);
          });
        })
    )
    .then(stats => {
      logger.trace({ message: 'preview built', time: process.hrtime(startTime) });
      logger.info(stats.hash);
      stats.toJson().warnings.forEach(e => logger.warn(e));
    })
    .then(() => {
      logger.info(`output directory: ${outputDir}`);
    })
    .catch(p => {
      if (p && p.toJson) {
        p.toJson().errors.forEach(e => logger.error(e));
        p.toJson().warnings.forEach(e => logger.error(e));
      } else {
        console.log('THE ERROR', p);
      }
    });
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
