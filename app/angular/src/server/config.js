import { configLoaderCreator } from '@storybook/core/server';
import { logger } from '@storybook/node-logger';

import defaultConfig from './config/babel';
import loadTsConfig from './ts_config';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';

const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(process.cwd());

if (cliWebpackConfigOptions) {
  logger.info('=> Loading angular-cli config.');
}

const configLoader = configLoaderCreator({
  defaultConfigName: 'angular-cli',
  defaultBabelConfig: defaultConfig,
  wrapInitialConfig: (config, configDir) => {
    const tsRule = config.module.rules[1];

    tsRule.loaders[0].options = loadTsConfig(configDir);

    return config;
  },
  wrapDefaultConfig: config => applyAngularCliWebpackConfig(config, cliWebpackConfigOptions),
  wrapBasicConfig: config => applyAngularCliWebpackConfig(config, cliWebpackConfigOptions),
});

export default configLoader;
