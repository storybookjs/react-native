import loadCustomAddons from '../utils/load-custom-addons-file';
import createDevConfig from './manager-webpack.config';

export async function managerWebpack(_, options) {
  return createDevConfig(options);
}

export async function managerEntries(installedAddons, options) {
  const { managerEntry = '../../client/manager' } = options;
  const entries = [require.resolve('../common/polyfills')];

  if (installedAddons && installedAddons.length) {
    entries.push(...installedAddons);
  }

  entries.push(require.resolve(managerEntry));

  return entries;
}

export * from '../common/common-preset';
