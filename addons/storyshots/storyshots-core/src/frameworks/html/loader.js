import global from 'global';
import configure from '../configure';

function test(options) {
  return options.framework === 'html';
}

function load(options) {
  global.STORYBOOK_ENV = 'html';

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/html');

  configure({ configPath, config, storybook });

  return {
    framework: 'html',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for HTML');
    },
    storybook,
  };
}

export default {
  load,
  test,
};
