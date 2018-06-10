import appOptions from '@storybook/angular/options';

import global from 'global';
import runWithRequireContext from '../require_context';
import loadConfig from '../config-loader';

function test(options) {
  return options.framework === 'html';
}

function load(options) {
  global.STORYBOOK_ENV = 'html';

  const { content, contextOpts } = loadConfig({
    configDirPath: options.configPath,
    appOptions,
  });

  runWithRequireContext(content, contextOpts);

  return {
    framework: 'html',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for HTML');
    },
    storybook: require.requireActual('@storybook/html'),
  };
}

export default {
  load,
  test,
};
