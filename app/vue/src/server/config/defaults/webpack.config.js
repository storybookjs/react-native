import { createDefaultWebpackConfig } from '@storybook/core/server';
import { includePaths } from '../utils';

module.exports = storybookBaseConfig =>
  createDefaultWebpackConfig(storybookBaseConfig, includePaths);
