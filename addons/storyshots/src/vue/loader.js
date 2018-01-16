import global from 'global';
import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';
import loadConfig from '../config-loader';

function mockVueToIncludeCompiler() {
  jest.mock('vue', () => require.requireActual('vue/dist/vue.common.js'));
}

function test(options) {
  return options.framework === 'vue' || (!options.framework && hasDependency('@storybook/vue'));
}

function load(options) {
  global.STORYBOOK_ENV = 'vue';
  mockVueToIncludeCompiler();

  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    babelConfigPath: '@storybook/vue/dist/server/babel_config',
  });

  runWithRequireContext(content, contextOpts);

  return {
    framework: 'vue',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for vue');
    },
    storybook: require.requireActual('@storybook/vue'),
  };
}

export default {
  load,
  test,
};
