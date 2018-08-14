import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';
import { isBuildAngularInstalled, normalizeAssetPatterns } from './angular-cli_utils';

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

  return {
    root: project.root,
    projectRoot: dirToSearch,
    supportES2015: false,
    tsConfig: {
      options: {},
      fileNames: [],
      errors: [],
    },
    tsConfigPath: path.resolve(dirToSearch, 'src/tsconfig.app.json'),
    buildOptions: {
      ...projectOptions,
      assets: normalizedAssets,
    },
  };
}

export function applyAngularCliWebpackConfig(baseConfig, cliWebpackConfigOptions) {
  if (!cliWebpackConfigOptions) return baseConfig;

  if (!isBuildAngularInstalled()) {
    logger.info('=> Using base config because @angular-devkit/build-angular is not installed.');
    return baseConfig;
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const ngcliConfigFactory = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');

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
