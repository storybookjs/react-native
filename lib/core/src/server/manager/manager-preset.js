import loadCustomAddons from '../utils/load-custom-addons-file';
import createDevConfig from './manager-webpack.config';

export async function managerWebpack(_, options) {
  return createDevConfig(options);
}

export async function managerEntries(_, options) {
  const { presets } = options;
  const entries = [];

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
