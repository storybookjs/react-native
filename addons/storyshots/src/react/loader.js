import runWithRequireContext from '../require_context';
import hasDependency from '../hasDependency';
import loadConfig from '../config-loader';

function test(options) {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options) {
  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    babelConfigPath: '@storybook/react/dist/server/babel_config',
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
