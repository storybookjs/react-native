import { applyCRAWebpackConfig } from './cra_config';

export function webpackFinal(config) {
  return applyCRAWebpackConfig(config);
}
