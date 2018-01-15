import path from 'path';

const babel = require('babel-core');

function getConfigContent({ resolvedConfigDirPath, configPath, babelConfigPath }) {
  const loadBabelConfig = require.requireActual(babelConfigPath).default;
  const babelConfig = loadBabelConfig(resolvedConfigDirPath);
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
