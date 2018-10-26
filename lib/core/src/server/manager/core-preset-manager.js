import loadCustomBabelConfig from '../utils/load-custom-babel-config';
import loadCustomAddons from '../utils/load-custom-addons-file';
import loadCustomConfig from '../utils/load-custom-config-file';
import createDevConfig from './webpack.config.manager';
import babelConfig from '../common/babel';

export async function managerWebpack(_, options) {
  return createDevConfig(options);
}

export async function managerBabel(_, options) {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelConfig(options), options)
  );
}

export async function managerEntries(_, options) {
  const { presets } = options;
  const entries = [require.resolve('../common/polyfills')];

  const installedAddons = await presets.apply('addons', [], options);

  if (installedAddons && installedAddons.length) {
    entries.push(...installedAddons);
  }

  entries.push(require.resolve('../../client/manager'));

  return entries;
}

export async function addons(_, options) {
  return loadCustomAddons(options);
}

export async function config(_, options) {
  return loadCustomConfig(options);
}
