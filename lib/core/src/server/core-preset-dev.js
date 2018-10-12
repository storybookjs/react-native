import loadCustomBabelConfig from './loadCustomBabelConfig';
import loadCustomAddons from './loadCustomAddonsFile';
import loadCustomConfig from './loadCustomConfigFile';
import createDevConfig from './config/webpack.config.iframe.dev';
import defaultBabelConfig from './config/babel.dev';
import { createManagerEntry, createPreviewEntry } from './config/entries';

export function webpack(_, options) {
  return createDevConfig(options);
}

export function babel(_, options) {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', defaultBabelConfig, options)
  );
}

export function manager(_, options) {
  return createManagerEntry(options);
}

export function preview(_, options) {
  return [
    ...createPreviewEntry(options),
    `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
  ];
}

export function addons(_, options) {
  return loadCustomAddons(options);
}

export function config(_, options) {
  return loadCustomConfig(options);
}
