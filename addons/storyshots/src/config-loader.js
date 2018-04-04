import path from 'path';
import { loadBabelConfig } from '@storybook/core/server';

const babel = require('babel-core');

function getConfigContent({ resolvedConfigDirPath, configPath, babelConfigPath }) {
  const defaultBabelConfig = require.requireActual(babelConfigPath).default;
  const babelConfig = loadBabelConfig(resolvedConfigDirPath, defaultBabelConfig);
  return babel.transformFileSync(configPath, babelConfig).code;
}

function load({ configDirPath, babelConfigPath }) {
  const resolvedConfigDirPath = path.resolve(configDirPath || '.storybook');
  const configPath = path.join(resolvedConfigDirPath, 'config.js');

  const content = getConfigContent({ resolvedConfigDirPath, configPath, babelConfigPath });
  const contextOpts = { filename: configPath, dirname: resolvedConfigDirPath };

  return {
    content,
    contextOpts,
  };
}

export default load;
