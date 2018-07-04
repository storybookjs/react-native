import configure from '../configure';
import hasDependency from '../hasDependency';

function test(options) {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options) {
  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/react');

  configure({ configPath, config, storybook });

  return {
    framework: 'react',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: require.requireActual('./renderShallowTree').default,
    storybook,
  };
}

export default {
  load,
  test,
};
