import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';
import loadConfig from '../config-loader';

function test(options) {
  return (
    options.framework === 'angular' || (!options.framework && hasDependency('@storybook/angular'))
  );
}

function load(options) {
  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    babelConfigPath: '@storybook/angular/dist/server/babel_config',
  });

  runWithRequireContext(content, contextOpts);

  return {
    framework: 'angular',
    renderTree: require.requireActual('./renderTree').default,
    storybook: require.requireActual('@storybook/angular'),
  };
}

export default {
  load,
  test,
};
