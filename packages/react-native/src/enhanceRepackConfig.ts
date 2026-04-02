import { StorybookPlugin } from './repack/withStorybook';
import type { WithStorybookOptions } from './metro/utils';

export function enhanceRepackConfig<T extends Record<string, any>>(
  config: T,
  options: WithStorybookOptions
): T {
  return {
    ...config,
    plugins: [...(config.plugins || []), new StorybookPlugin(options)],
  } as T;
}
