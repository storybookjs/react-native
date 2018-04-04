import { configLoaderCreator } from '@storybook/core/server';
import defaultConfig from './config/babel';

const configLoader = configLoaderCreator({
  defaultConfigName: 'polymer-cli',
  defaultBabelConfig: defaultConfig,
});

export default configLoader;
