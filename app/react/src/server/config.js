import { configLoaderCreator } from '@storybook/core/server';
import defaultConfig from './config/babel';
import wrapBabelConfig from './wrapBabelConfig';

const configLoader = configLoaderCreator({
  defaultConfigName: 'create-react-app',
  defaultBabelConfig: defaultConfig,
  wrapBabelConfig,
});

export default configLoader;
