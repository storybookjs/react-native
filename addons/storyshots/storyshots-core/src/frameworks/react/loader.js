import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';
import loadConfig from '../config-loader';

function test(options) {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options) {
  const appOptions = require.requireActual('@storybook/react/options').default;

  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    appOptions,
  });

  runWithRequireContext(content, contextOpts);

  return {
    framework: 'react',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: require.requireActual('./renderShallowTree').default,
    storybook: require.requireActual('@storybook/react'),
  };
}

export default {
  load,
  test,
};
