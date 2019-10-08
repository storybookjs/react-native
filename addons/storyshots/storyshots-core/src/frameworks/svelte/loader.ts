import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'svelte' || (!options.framework && hasDependency('@storybook/svelte'))
  );
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'svelte';

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/svelte');

  configure({ configPath, config, storybook });

  return {
    framework: 'svelte' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for svelte');
    },
    storybook,
  };
}

const svelteLoader: Loader = {
  load,
  test,
};

export default svelteLoader;
