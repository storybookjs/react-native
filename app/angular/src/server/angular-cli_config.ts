import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import {
  filterOutStylingRules,
  getAngularCliParts,
  isBuildAngularInstalled,
  normalizeAssetPatterns,
} from './angular-cli_utils';
import { Configuration } from 'webpack';
import { Path } from '@angular-devkit/core';

interface BasicOptions {
  options: {
    baseUrl?: string;
  };
  raw: object;
  fileNames: string[];
  errors: any[]; // todo string[] or object[]?
}

function getTsConfigOptions(tsConfigPath: string) {
  const basicOptions: BasicOptions = {
    options: {},
    raw: {},
    fileNames: [],
    errors: [],
  };

  if (!fs.existsSync(tsConfigPath)) {
    return basicOptions;
  }

  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  const { baseUrl }: { baseUrl?: string } = tsConfig.compilerOptions || {};

  if (baseUrl) {
    const tsConfigDirName = path.dirname(tsConfigPath);
    basicOptions.options.baseUrl = path.resolve(tsConfigDirName, baseUrl);
  }

  return basicOptions;
}

export function getAngularCliWebpackConfigOptions(dirToSearch: Path) {
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

interface CliWebpackConfigOptions {
  buildOptions: {
    tsConfig: string;
  };
  supportES2015: boolean;
}

export function applyAngularCliWebpackConfig(
  baseConfig: Configuration,
  cliWebpackConfigOptions: CliWebpackConfigOptions
) {
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
    // todo webpack declared it like that: entry?: string | string[] | Entry | EntryFunc;
    // todo should we check for the different possible types?
    ...(baseConfig.entry as string[]),
    ...Object.values(cliStyleConfig.entry).reduce((acc: any, item: any) => acc.concat(item), []), // todo correct typings for acc and item
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
        // tslint:disable:max-line-length
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
