/* eslint-disable global-require,import/no-extraneous-dependencies */
import path from 'path';
import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';

const babel = require('babel-core');

function test(options) {
  return (
    options.framework === 'angular' || (!options.framework && hasDependency('@storybook/angular'))
  );
}

function load(options) {
  const storybook = require.requireActual('@storybook/angular');
  const loadBabelConfig = require('@storybook/angular/dist/server/babel_config').default;

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
    framework: 'angular',
    storybook,
  };
}

export default {
  load,
  test,
};
