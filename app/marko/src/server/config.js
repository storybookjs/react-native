import { configLoaderCreator } from '@storybook/core/server';
import defaultConfig from './config/babel';

const configLoader = configLoaderCreator({
  defaultConfigName: 'create-marko-app',
  defaultBabelConfig: defaultConfig,
});

export default configLoader;
