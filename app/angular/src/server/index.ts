import { buildDev } from '@storybook/core/server';
import options from './options';

// todo add correct type
export type WebpackConfig = any;

export interface TsLoaderOptions {
  configFile: string;
}

buildDev(options);
