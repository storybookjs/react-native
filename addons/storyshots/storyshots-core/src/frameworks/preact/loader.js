/** @jsx h */

import global from 'global';
import configure from '../configure';
import hasDependency from '../hasDependency';

function test(options) {
  return (
    options.framework === 'preact' || (!options.framework && hasDependency('@storybook/preact'))
  );
}

function load(options) {
  global.STORYBOOK_ENV = 'preact';

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/preact');

  configure({ configPath, config, storybook });

  return {
    framework: 'preact',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for preact');
    },
    storybook,
  };
}

export default {
  load,
  test,
};
