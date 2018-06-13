import loadConfig from './config-loader';
import runWithRequireContext from './require_context';

function configure(options) {
  const { configPath = '.storybook', config, frameworkOptions, storybook } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const appOptions = require.requireActual(frameworkOptions).default;

  const { content, contextOpts } = loadConfig({
    configPath,
    appOptions,
  });

  runWithRequireContext(content, contextOpts);
}

export default configure;
