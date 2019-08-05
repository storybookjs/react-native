/** @jsx h */

import global from 'global';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'preact' || (!options.framework && hasDependency('@storybook/preact'))
  );
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'preact';

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/preact');

  configure({ configPath, config, storybook });

  return {
    framework: 'preact' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for preact');
    },
    storybook,
  };
}

const preactLoader: Loader = {
  load,
  test,
};

export default preactLoader;
