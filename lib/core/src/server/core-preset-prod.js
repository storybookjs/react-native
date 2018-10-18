import loadCustomBabelConfig from './loadCustomBabelConfig';
import loadCustomAddons from './loadCustomAddonsFile';
import loadCustomConfig from './loadCustomConfigFile';
import createProdConfig from './config/webpack.config.prod';
import defaultBabelConfig from './config/babel.prod';
import { createManagerEntry, createPreviewEntry } from './config/entries';

export async function webpack(_, options) {
  return createProdConfig(options);
}

export async function babel(_, options) {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', defaultBabelConfig, options)
  );
}

export async function manager(_, options) {
  return createManagerEntry(options);
}

export async function preview(_, options) {
  return createPreviewEntry(options);
}

export async function addons(_, options) {
  return loadCustomAddons(options);
}

export async function config(_, options) {
  return loadCustomConfig(options);
}
