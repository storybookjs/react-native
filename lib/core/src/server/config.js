/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import findCacheDir from 'find-cache-dir';
import interpret from 'interpret';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';
import devBabelConfig from './config/babel';
import loadBabelConfig from './babel_config';

const noopWrapper = config => config;

function getBabelConfig({
  configDir,
  defaultBabelConfig = devBabelConfig,
  wrapDefaultBabelConfig = noopWrapper,
  wrapBabelConfig = noopWrapper,
}) {
  const defaultConfig = wrapDefaultBabelConfig(defaultBabelConfig);
  return wrapBabelConfig(loadBabelConfig(configDir, defaultConfig));
}

function mergeConfigs(config, customConfig) {
  return {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // Override with custom devtool if provided
    devtool: customConfig.devtool || config.devtool,
    // We need to use our and custom plugins.
    plugins: [...config.plugins, ...(customConfig.plugins || [])],
    module: {
      ...config.module,
      // We need to use our and custom rules.
      ...customConfig.module,
      rules: [
        ...config.module.rules,
        ...((customConfig.module && customConfig.module.rules) || []),
      ],
    },
    resolve: {
      ...config.resolve,
      ...customConfig.resolve,
      alias: {
        ...config.alias,
        ...(customConfig.resolve && customConfig.resolve.alias),
      },
    },
  };
}

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L102-L119
function registerCompiler(moduleDescriptor) {
  if (!moduleDescriptor) {
    return 0;
  }

  if (typeof moduleDescriptor === 'string') {
    require(moduleDescriptor);
    return 1;
  }

  if (!Array.isArray(moduleDescriptor)) {
    moduleDescriptor.register(require(moduleDescriptor.module));
    return 1;
  }

  let registered = 0;

  for (let i = 0; i < moduleDescriptor.length; i += 1) {
    try {
      registered += registerCompiler(moduleDescriptor[i]);
      break;
    } catch (e) {
      // do nothing
    }
  }

  return registered;
}

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L121-L137
function requireConfig(configPath) {
  const config = require(configPath);

  const isES6DefaultExported =
    typeof config === 'object' && config !== null && typeof config.default !== 'undefined';

  return isES6DefaultExported ? config.default : config;
}

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L45-L143
function loadCustomConfig(configDir) {
  const extensions = Object.keys(interpret.extensions).sort((a, b) => {
    if (a === '.js') {
      return -1;
    }
    if (b === '.js') {
      return 1;
    }
    return a.length - b.length;
  });
  const customConfigCandidates = ['webpack.config', 'webpackfile']
    .map(filename =>
      extensions.map(ext => ({
        path: path.resolve(configDir, filename + ext),
        ext,
      }))
    )
    .reduce((a, i) => a.concat(i), []);

  for (let i = 0; i < customConfigCandidates.length; i += 1) {
    const customConfigPath = customConfigCandidates[i].path;
    if (fs.existsSync(customConfigPath)) {
      if (registerCompiler(interpret.extensions[customConfigCandidates[i].ext]) === 0) {
        logger.warn(`=> Custom configuration file ${customConfigPath} is detected`);
        logger.warn(`   but impossible to import loader for ${customConfigCandidates[i].ext}`);
      }
      try {
        return requireConfig(customConfigPath);
      } catch (e) {
        return null;
      }
    }
  }

  return null;
}

// `baseConfig` is a webpack configuration bundled with storybook.
// Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default options => {
  const {
    configType,
    getBaseConfig,
    configDir,
    defaultConfigName,
    wrapInitialConfig = noopWrapper,
    wrapBasicConfig = noopWrapper,
    wrapDefaultConfig = noopWrapper,
  } = options;

  const babelOptions = {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...getBabelConfig(options),
  };
  const baseConfig = getBaseConfig({ ...options, babelOptions });
  const config = wrapInitialConfig(baseConfig, configDir);

  const defaultConfig = wrapDefaultConfig(createDefaultWebpackConfig(config));

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomConfig(configDir);

  if (customConfig === null) {
    informAboutCustomConfig(defaultConfigName);
    return defaultConfig;
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(wrapBasicConfig(config), configType, defaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(config, customConfig);
};
