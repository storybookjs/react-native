import { buildDev } from '@storybook/core/server';
import path from 'path';
import packageJson from '../../package.json';
import getBaseConfig from './config/webpack.config';
import loadConfig from './config';

buildDev({
  packageJson,
  getBaseConfig,
  loadConfig,
  defaultFavIcon: path.resolve(__dirname, 'public/favicon.ico'),
});
