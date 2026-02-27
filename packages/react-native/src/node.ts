import type { StorybookConfig } from './types/config';

export { createChannelServer } from './metro/channelServer';
export { buildIndex } from './metro/buildIndex';

export function defineMain(config: StorybookConfig) {
  return config;
}
