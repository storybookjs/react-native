import { configLoaderCreator } from '@storybook/core/server';
import defaultConfig from './config/babel';

const configLoader = configLoaderCreator({
  defaultBabelConfig: defaultConfig,
});

export default configLoader;
