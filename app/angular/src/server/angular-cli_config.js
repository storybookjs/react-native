import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import {
  isBuildAngularInstalled,
  normalizeAssetPatterns,
  filterOutStylingRules,
  getAngularCliParts,
} from './angular-cli_utils';

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
      sourceMap: false,
      optimization: {},
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

  // Don't use storybooks styling rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.
  const rulesExcludingStyles = filterOutStylingRules(baseConfig);

  // cliStyleConfig.entry adds global style files to the webpack context
  const entry = [
    ...baseConfig.entry,
    ...Object.values(cliStyleConfig.entry).reduce((acc, item) => acc.concat(item), []),
  ];

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
        // After ng build my-lib the default value of 'main' in the package.json is 'umd'
        // This causes that you cannot import components directly from dist
        // https://github.com/angular/angular-cli/blob/9f114aee1e009c3580784dd3bb7299bdf4a5918c/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/browser.ts#L68
        mainFields: [
          ...(cliWebpackConfigOptions.supportES2015 ? ['es2015'] : []),
          'browser',
          'module',
          'main',
        ],
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
