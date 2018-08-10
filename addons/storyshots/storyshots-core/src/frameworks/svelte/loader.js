import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';

function test(options) {
  return (
    options.framework === 'svelte' || (!options.framework && hasDependency('@storybook/svelte'))
  );
}

function load(options) {
  global.STORYBOOK_ENV = 'svelte';

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/svelte');

  configure({ configPath, config, storybook });

  return {
    framework: 'svelte',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for svelte');
    },
    storybook,
  };
}

export default {
  load,
  test,
};
