import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { isBuildAngularInstalled, normalizeAssetPatterns } from './angular-cli_utils';

function getTsConfigOptions(tsConfigPath) {
  const basicOptions = {
    options: {},
    raw: {},
    fileNames: [],
    errors: [],
  };

  if (!fs.existsSync(tsConfigPath)) {
    return basicOptions;
  }

  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  const { baseUrl } = tsConfig.compilerOptions || {};

  if (baseUrl) {
    const tsConfigDirName = path.dirname(tsConfigPath);
    basicOptions.options.baseUrl = path.resolve(tsConfigDirName, baseUrl);
  }

  return basicOptions;
}

function getAngularCliParts(cliWebpackConfigOptions) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const ngCliConfigFactory = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');

  try {
    return {
      cliCommonConfig: ngCliConfigFactory.getCommonConfig(cliWebpackConfigOptions),
      cliStyleConfig: ngCliConfigFactory.getStylesConfig(cliWebpackConfigOptions),
    };
  } catch (e) {
    return null;
  }
}

export function getAngularCliWebpackConfigOptions(dirToSearch) {
  const fname = path.join(dirToSearch, 'angular.json');

  if (!fs.existsSync(fname)) {
    return null;
  }

  const angularJson = JSON.parse(fs.readFileSync(fname, 'utf8'));
  const { projects, defaultProject } = angularJson;

  if (!projects || !Object.keys(projects).length) {
    throw new Error('angular.json must have projects entry.');
  }

  let project = projects[Object.keys(projects)[0]];

  if (defaultProject) {
    project = projects[defaultProject];
  }

  const { options: projectOptions } = project.architect.build;

  const normalizedAssets = normalizeAssetPatterns(
    projectOptions.assets,
    dirToSearch,
    project.sourceRoot
  );

  const projectRoot = path.resolve(dirToSearch, project.root);
  const tsConfigPath = path.resolve(dirToSearch, projectOptions.tsConfig);
  const tsConfig = getTsConfigOptions(tsConfigPath);

  return {
    root: dirToSearch,
    projectRoot,
    tsConfigPath,
    tsConfig,
    supportES2015: false,
    buildOptions: {
      ...projectOptions,
      assets: normalizedAssets,
    },
  };
}

export function applyAngularCliWebpackConfig(baseConfig, cliWebpackConfigOptions) {
  if (!cliWebpackConfigOptions) {
    return baseConfig;
  }

  if (!isBuildAngularInstalled()) {
    logger.info('=> Using base config because @angular-devkit/build-angular is not installed.');
    return baseConfig;
  }

  const cliParts = getAngularCliParts(cliWebpackConfigOptions);

  if (!cliParts) {
    logger.warn('=> Failed to get angular-cli webpack config.');
    return baseConfig;
  }

  logger.info('=> Get angular-cli webpack config.');

  const { cliCommonConfig, cliStyleConfig } = cliParts;

  // Don't use storybooks .css/.scss rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.
  const rulesExcludingStyles = baseConfig.module.rules.filter(
    rule =>
      !rule.test || (rule.test.toString() !== '/\\.css$/' && rule.test.toString() !== '/\\.scss$/')
  );

  // cliStyleConfig.entry adds global style files to the webpack context
  const entry = {
    ...baseConfig.entry,
    iframe: []
      .concat(baseConfig.entry.iframe)
      .concat(Object.values(cliStyleConfig.entry).reduce((acc, item) => acc.concat(item), [])),
  };

  const module = {
    ...baseConfig.module,
    rules: [...cliStyleConfig.module.rules, ...rulesExcludingStyles],
  };

  // We use cliCommonConfig plugins to serve static assets files.
  const plugins = [...cliStyleConfig.plugins, ...cliCommonConfig.plugins, ...baseConfig.plugins];

  const resolve = {
    ...baseConfig.resolve,
    modules: Array.from(
      new Set([...baseConfig.resolve.modules, ...cliCommonConfig.resolve.modules])
    ),
    plugins: [
      new TsconfigPathsPlugin({
        configFile: cliWebpackConfigOptions.buildOptions.tsConfig,
      }),
    ],
  };

  return {
    ...baseConfig,
    entry,
    module,
    plugins,
    resolve,
    resolveLoader: cliCommonConfig.resolveLoader,
  };
}
