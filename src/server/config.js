import fs from 'fs';
import path from 'path';
import cjson from 'cjson';

// avoid ESLint errors
const logger = console;

// Tries to load a .babelrc and returns the parsed object if successful
function loadBabelConfig(babelConfigPath) {
  let config;
  if (fs.existsSync(babelConfigPath)) {
    const content = fs.readFileSync(babelConfigPath, 'utf-8');
    try {
      config = cjson.parse(content);
      config.babelrc = false;
      logger.info('=> Loading custom .babelrc');
    } catch (e) {
      logger.error(`=> Error parsing .babelrc file: ${e.message}`);
      throw e;
    }
  }
  return config;
}

// `baseConfig` is a webpack configuration bundled with storybook.
// React Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default function (baseConfig, configDir) {
  const config = baseConfig;

  // search for a .babelrc in the config directory, then the module root directory
  // if found, use that to extend webpack configurations
  const babelConfig =
    loadBabelConfig(path.resolve(configDir, '.babelrc')) ||
    loadBabelConfig('.babelrc');
  if (babelConfig) {
    config.module.loaders[0].query = babelConfig;
  }

  // Dev build needs some specific babel presets.
  // So, we need to add them here, if not specified.
  if (process.env.DEV_BUILD) {
    const requiredPresets = ['react', 'es2015', 'stage-2'];
    const loadedPresets = config.module.loaders[0].query.presets;
    requiredPresets.forEach((preset) => {
      if (loadedPresets.indexOf(preset) < 0) {
        loadedPresets.push(preset);
      }
    });
  }

  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = path.resolve(configDir, 'config.js');
  if (!fs.existsSync(storybookConfigPath)) {
    const err = new Error(`=> Create a storybook config file in "${configDir}/config.js".`);
    throw err;
  }
  config.entry.preview.push(storybookConfigPath);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfigPath = path.resolve(configDir, 'webpack.config.js');
  if (!fs.existsSync(customConfigPath)) {
    return config;
  }

  const customConfig = require(customConfigPath);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(config);
  }

  logger.info('=> Loading custom webpack config.');

  return {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // We need to use our and custom plugins.
    plugins: [
      ...config.plugins,
      ...customConfig.plugins || [],
    ],
    module: {
      ...config.module,
      // We need to use our and custom loaders.
      ...customConfig.module || {},
      loaders: [
        ...config.module.loaders,
        ...customConfig.module.loaders || [],
      ],
    },
  };
}
