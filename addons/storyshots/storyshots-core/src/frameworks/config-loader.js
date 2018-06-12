import fs from 'fs';
import path from 'path';
import { getBabelConfig } from '@storybook/core/server';

const babel = require('babel-core');

function getConfigContent({ resolvedConfigDirPath, resolvedConfigPath, appOptions }) {
  const babelConfig = getBabelConfig({
    ...appOptions,
    configDir: resolvedConfigDirPath,
  });
  return babel.transformFileSync(resolvedConfigPath, babelConfig).code;
}

function getConfigPathParts(configPath) {
  const resolvedConfigPath = path.resolve(configPath);

  if (fs.lstatSync(resolvedConfigPath).isDirectory()) {
    return {
      resolvedConfigDirPath: resolvedConfigPath,
      resolvedConfigPath: path.join(resolvedConfigPath, 'config.js'),
    };
  }

  return {
    resolvedConfigDirPath: path.dirname(resolvedConfigPath),
    resolvedConfigPath,
  };
}

function load({ configPath, appOptions }) {
  const { resolvedConfigPath, resolvedConfigDirPath } = getConfigPathParts(configPath);

  const content = getConfigContent({ resolvedConfigDirPath, resolvedConfigPath, appOptions });
  const contextOpts = { filename: resolvedConfigPath, dirname: resolvedConfigDirPath };

  return {
    content,
    contextOpts,
  };
}

export default load;
