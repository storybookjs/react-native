import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import shelljs from 'shelljs';
import childProcess from 'child-process-promise';

import { logger } from '@storybook/node-logger';

import { getProdCli } from './cli';
import loadConfig from './config';
import { loadEnv } from './config/utils';

const defaultFavIcon = require.resolve('./public/favicon.ico');

export async function buildStaticStandalone(options) {
  const { outputDir, staticDir, watch, configDir, packageJson } = options;
  const environment = loadEnv();

  // create output directory if not exists
  shelljs.mkdir('-p', path.resolve(outputDir));
  // clear the static dir
  shelljs.rm('-rf', path.resolve(outputDir, 'static'));
  shelljs.cp(defaultFavIcon, outputDir);

  logger.info('building manager..');
  const managerStartTime = process.hrtime();
  await childProcess
    .exec(
      `node ${path.join(__dirname, 'manager/webpack.js')} dir=${configDir} out=${path.resolve(
        outputDir
      )}`,
      {
        env: {
          NODE_ENV: 'production',
          ...environment,
        },
      }
    )
    .then(() => {
      const managerTotalTime = process.hrtime(managerStartTime);
      logger.trace({ message: 'manager built', time: managerTotalTime });
    });

  // Build the webpack configuration using the `baseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  // NOTE changes to env should be done before calling `getBaseConfig`
  const config = await loadConfig({
    configType: 'PRODUCTION',
    outputDir,
    packageJson,
    corePresets: [require.resolve('./preview/core-preset-preview.js')],
    overridePresets: [require.resolve('./preview/core-preset-webpack-custom.js')],
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
      shelljs.cp('-r', `${dir}/*`, outputDir);
    });
  }

  // compile all resources with webpack and write them to the disk.
  logger.info('building preview..');
  const previewStartTime = process.hrtime();
  const webpackCb = (err, stats) => {
    if (err || stats.hasErrors()) {
      logger.error('Failed to build the storybook');
      // eslint-disable-next-line no-unused-expressions
      err && logger.error(err.message);
      // eslint-disable-next-line no-unused-expressions
      stats && stats.hasErrors() && stats.toJson().errors.forEach(e => logger.error(e));
      process.exitCode = 1;
    }
    const previewTotalTime = process.hrtime(previewStartTime);
    logger.trace({ message: 'preview built', time: previewTotalTime });
  };

  const compiler = webpack(config);

  if (watch) {
    compiler.watch({}, webpackCb);
  } else {
    compiler.run(webpackCb);
  }
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
