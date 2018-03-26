import { buildStatic } from '@storybook/core/server';
import path from 'path';
import packageJson from '../../package.json';
import getBaseConfig from './config/webpack.config.prod';
import loadConfig from './config';

buildStatic({
  packageJson,
  getBaseConfig,
  loadConfig,
  defaultFavIcon: path.resolve(__dirname, 'public/favicon.ico'),
});
