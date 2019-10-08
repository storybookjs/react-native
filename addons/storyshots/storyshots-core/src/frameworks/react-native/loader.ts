/* eslint-disable global-require */
import path from 'path';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'react-native' ||
    (!options.framework && hasDependency('@storybook/react-native'))
  );
}

function configure(options: StoryshotsOptions, storybook: any) {
  const { configPath = 'storybook', config } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const resolvedConfigPath = path.resolve(configPath);
  require.requireActual(resolvedConfigPath);
}

function load(options: StoryshotsOptions) {
  const storybook = require.requireActual('@storybook/react-native');

  configure(options, storybook);

  return {
    renderTree: require('../react/renderTree').default,
    renderShallowTree: require('../react/renderShallowTree').default,
    framework: 'react-native' as const,
    storybook,
  };
}

const reactNativeLoader: Loader = {
  load,
  test,
};

export default reactNativeLoader;
