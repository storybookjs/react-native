import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import shelljs from 'shelljs';

import { logger } from '@storybook/node-logger';

import { getProdCli } from './cli';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';

const defaultFavIcon = require.resolve('./public/favicon.ico');

export async function buildStaticStandalone(options) {
  const { staticDir, watch, configDir, packageJson } = options;

  const configType = 'PRODUCTION';
  const outputDir = path.join(process.cwd(), options.outputDir);

  // create output directory if not exists
  shelljs.mkdir('-p', outputDir);
  // clear the static dir
  shelljs.rm('-rf', path.join(outputDir, 'static'));
  shelljs.cp(defaultFavIcon, outputDir);

  logger.info('building manager..');
  const managerStartTime = process.hrtime();

  const managerConfig = await loadManagerConfig({
    configType,
    outputDir,
    configDir,
    corePresets: [require.resolve('./manager/manager-preset.js')],
  });

  await new Promise((res, rej) => {
    webpack(managerConfig).run((err, stats) => {
      const managerTotalTime = process.hrtime(managerStartTime);
      logger.trace({ message: 'manager built', time: managerTotalTime });

      if (err) {
        rej(err);
      } else if (stats.hasErrors()) {
        rej(stats);
      } else {
        res(stats);
      }
    });
  });

  // Build the webpack configuration using the `baseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  // NOTE changes to env should be done before calling `getBaseConfig`
  const config = await loadConfig({
    configType,
    outputDir,
    packageJson,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
    ...options,
  });

  // config.output.path = path.resolve(outputDir);

  // copy all static files
  if (staticDir) {
    staticDir.forEach(dir => {
      if (!fs.existsSync(dir)) {
        logger.error(`Error: no such directory to load static files: ${dir}`);
        process.exit(-1);
      }
      logger.info(`=> Copying static files from: ${dir}`);
      shelljs.cp('-r', `${dir}/!(index.html)`, outputDir);
    });
  }

  // compile all resources with webpack and write them to the disk.
  return new Promise((resolve, reject) => {
    const previewStartTime = process.hrtime();

    const webpackCb = (err, stats) => {
      if (err || stats.hasErrors()) {
        logger.error('Failed to build the storybook');
        // eslint-disable-next-line no-unused-expressions
        err && logger.error(err.message);
        // eslint-disable-next-line no-unused-expressions
        stats && stats.hasErrors() && stats.toJson().errors.forEach(e => logger.error(e));
        process.exitCode = 1;
        return reject(err);
      }

      const previewTotalTime = process.hrtime(previewStartTime);
      logger.trace({ message: 'preview built', time: previewTotalTime });

      return resolve(stats);
    };

    logger.info('building preview..');
    const compiler = webpack(config);

    if (watch) {
      compiler.watch({}, webpackCb);
    } else {
      compiler.run(webpackCb);
    }
  });
}

export async function buildStatic({ packageJson, ...loadOptions }) {
  const cliOptions = getProdCli(packageJson);

  await buildStaticStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: cliOptions.configDir || './.storybook',
    outputDir: cliOptions.outputDir || './storybook-static',
  });
}
