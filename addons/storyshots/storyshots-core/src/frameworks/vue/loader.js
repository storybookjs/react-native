import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';

function mockVueToIncludeCompiler() {
  jest.mock('vue', () => require.requireActual('vue/dist/vue.common.js'));
}

function test(options) {
  return options.framework === 'vue' || (!options.framework && hasDependency('@storybook/vue'));
}

function load(options) {
  global.STORYBOOK_ENV = 'vue';
  mockVueToIncludeCompiler();

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/vue');

  configure({ configPath, config, storybook });

  return {
    framework: 'vue',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for vue');
    },
    storybook,
  };
}

export default {
  load,
  test,
};
