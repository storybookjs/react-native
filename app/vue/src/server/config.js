import { configLoaderCreator } from '@storybook/core/server';
import defaultConfig from './config/babel';

const configLoader = configLoaderCreator({
  defaultConfigName: 'vue-cli',
  defaultBabelConfig: defaultConfig,
});

export default configLoader;
