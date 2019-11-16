import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options: StoryshotsOptions) {
  const storybook = require.requireActual('@storybook/react');

  configure({ ...options, storybook });

  return {
    framework: 'react' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: require.requireActual('./renderShallowTree').default,
    storybook,
  };
}

const reactLoader: Loader = {
  load,
  test,
};

export default reactLoader;
