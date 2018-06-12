import path from 'path';
import { getBabelConfig } from '@storybook/core/server';

const babel = require('babel-core');

function getConfigContent({ resolvedConfigDirPath, configPath, appOptions }) {
  const babelConfig = getBabelConfig({
    ...appOptions,
    configDir: resolvedConfigDirPath,
  });
  return babel.transformFileSync(configPath, babelConfig).code;
}

function load({ configDirPath, appOptions }) {
  const resolvedConfigDirPath = path.resolve(configDirPath || '.storybook');
  const configPath = path.join(resolvedConfigDirPath, 'config.js');

  const content = getConfigContent({ resolvedConfigDirPath, configPath, appOptions });
  const contextOpts = { filename: configPath, dirname: resolvedConfigDirPath };

  return {
    content,
    contextOpts,
  };
}

export default load;
