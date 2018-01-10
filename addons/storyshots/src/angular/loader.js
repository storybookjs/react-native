import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';
import loadConfig from '../config-loader';

function setupAngularJestPreset() {
  // Angular + Jest + Storyshots = Crazy Shit:
  // We need to require 'jest-preset-angular/setupJest' before any storybook code
  // is running inside jest -  one of the things that `jest-preset-angular/setupJest` does is
  // extending the `window.Reflect` with all the needed metadata functions, that are required
  // for emission of the TS decorations like 'design:paramtypes'
  require.requireActual('jest-preset-angular/setupJest');
}

function test(options) {
  return (
    options.framework === 'angular' || (!options.framework && hasDependency('@storybook/angular'))
  );
}

function load(options) {
  setupAngularJestPreset();

  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    babelConfigPath: '@storybook/angular/dist/server/babel_config',
  });

  runWithRequireContext(content, contextOpts);

  return {
    framework: 'angular',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for angular');
    },
    storybook: require.requireActual('@storybook/angular'),
  };
}

export default {
  load,
  test,
};
