/* eslint-disable global-require,import/no-extraneous-dependencies */
import path from 'path';
import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';

const babel = require('babel-core');

function test(options) {
  return options.framework === 'vue' || (!options.framework && hasDependency('@storybook/vue'));
}

function load(options) {
  // Mock vue to have compiler-included build
  jest.mock('vue', () => {
    const vueCommonJs = require('vue/dist/vue.common.js');
    return vueCommonJs;
  });

  const storybook = require.requireActual('@storybook/vue');
  const loadBabelConfig = require('@storybook/vue/dist/server/babel_config').default;

  const configDirPath = path.resolve(options.configPath || '.storybook');
  const configPath = path.join(configDirPath, 'config.js');

  const babelConfig = loadBabelConfig(configDirPath);
  const content = babel.transformFileSync(configPath, babelConfig).code;
  const contextOpts = {
    filename: configPath,
    dirname: configDirPath,
  };

  runWithRequireContext(content, contextOpts);

  return {
    renderTree: require('./renderTree').default,
    framework: 'vue',
    storybook,
  };
}

export default {
  load,
  test,
};
