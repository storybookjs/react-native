import global from 'global';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'rax' || (!options.framework && hasDependency('@storybook/rax'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'rax';

  const storybook = require.requireActual('@storybook/rax');

  configure({ ...options, storybook });

  return {
    framework: 'rax' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for rax');
    },
    storybook,
  };
}

const raxLoader: Loader = {
  load,
  test,
};

export default raxLoader;
