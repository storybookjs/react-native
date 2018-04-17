import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';

function isAngularCliInstalled() {
  try {
    require.resolve('@angular/cli');
    return true;
  } catch (e) {
    return false;
  }
}

export function getAngularCliWebpackConfigOptions(dirToSearch, appIndex = 0) {
  const fname = path.join(dirToSearch, '.angular-cli.json');
  if (!fs.existsSync(fname)) {
    return null;
  }
  const cliConfig = JSON.parse(fs.readFileSync(fname, 'utf8'));
  if (!cliConfig.apps || !cliConfig.apps.length) {
    throw new Error('.angular-cli.json must have apps entry.');
  }
  const appConfig = cliConfig.apps[appIndex];

  const cliWebpackConfigOptions = {
    projectRoot: dirToSearch,
    appConfig,
    buildOptions: {
      outputPath: 'outputPath', // It's dummy value to avoid to Angular CLI's error
    },
    supportES2015: false,
  };

  return cliWebpackConfigOptions;
}

export function applyAngularCliWebpackConfig(baseConfig, cliWebpackConfigOptions) {
  if (!cliWebpackConfigOptions) return baseConfig;

  if (!isAngularCliInstalled()) {
    logger.info('=> Using base config because @angular/cli is not installed.');
    return baseConfig;
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const ngcliConfigFactory = require('@angular/cli/models/webpack-configs');

  let cliCommonConfig;
  let cliStyleConfig;
  try {
    cliCommonConfig = ngcliConfigFactory.getCommonConfig(cliWebpackConfigOptions);
    cliStyleConfig = ngcliConfigFactory.getStylesConfig(cliWebpackConfigOptions);
  } catch (e) {
    logger.warn('=> Failed to get angular-cli webpack config.');
    return baseConfig;
  }
  logger.info('=> Get angular-cli webpack config.');

  // Don't use storybooks .css/.scss rules because we have to use rules created by @angualr/cli
  // because @angular/cli created rules have include/exclude for global style files.
  const rulesExcludingStyles = baseConfig.module.rules.filter(
    rule =>
      !rule.test || (rule.test.toString() !== '/\\.css$/' && rule.test.toString() !== '/\\.scss$/')
  );

  // cliStyleConfig.entry adds global style files to the webpack context
  const entry = {
    ...baseConfig.entry,
    ...cliStyleConfig.entry,
  };

  const mod = {
    ...baseConfig.module,
    rules: [...cliStyleConfig.module.rules, ...rulesExcludingStyles],
  };

  // We use cliCommonConfig plugins to serve static assets files.
  const plugins = [...cliStyleConfig.plugins, ...cliCommonConfig.plugins, ...baseConfig.plugins];

  return {
    ...baseConfig,
    entry,
    module: mod,
    plugins,
    resolveLoader: cliCommonConfig.resolveLoader,
  };
}
